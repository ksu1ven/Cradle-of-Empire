import Match3Grid from "./match3/Match3Grid";
import Match3Board from "./match3/Match3Board";
import Match3InteractionManager from "./match3/Match3InteractionManager";
import Match3AnimationManager from "./match3/Match3AnimationManager";
import Match3CheckManager from "./match3/Match3CheckManager";
import Match3DropManager from "./match3/Match3DropManager";
import Match3Score from "./match3/Match3Score";
import Match3Story from "./match3/Match3Story";

import Field from "../elements/Field";

export default class Match3Stage {
	constructor() {
		this.grid = new Match3Grid(7, 7, [
			{ x: 0, y: 3 },
			{ x: 3, y: 0 },
			{ x: 6, y: 3 },
			{ x: 3, y: 6 },
		]);
		this.board = new Match3Board(7, 7);
		this.interactionManager = new Match3InteractionManager(7, 7);
		this.animationManager = new Match3AnimationManager();
		this.checkManager = new Match3CheckManager();
		this.dropManager = new Match3DropManager(7, 7);
		this.score = new Match3Score();
		this.story = new Match3Story();

		this.field = new Field();
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.events = scene.events;
		this.time = scene.time;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.audio("cameraSound", "/assets/sound/camera56.mp3");

		this.board.preload(scene);
		this.score.preload(scene);
		this.story.preload(scene);

		this.field.preload(scene);
	}

	createStage(scene) {
		this.bindVars(scene);

		this.group = this.add.group();

		this.field.create(scene, this.group);

		this.grid.create(scene);

		const cellSizeX =
			(this.field.field.width * this.field.finalScale - 2) / 7;
		const cellSizeY =
			(this.field.field.height * this.field.finalScale - 2) / 7;

		this.board.create(
			this.scene,
			this.grid.grid,
			this.group,
			this.field.field,
			cellSizeX,
			cellSizeY
		);

		this.sound.play("cameraSound", { volume: 1 });
		this.cameras.main.zoomTo(1.5, 1000);

		this.interactionManager.create(
			this.scene,
			this.grid.grid,
			this.board.chipSprites
		);
		this.animationManager.create(
			this.scene,
			this.field.field,
			this.board.chipSprites,
			this.group,
			cellSizeX,
			cellSizeY
		);
		this.checkManager.create(this.scene, this.grid.grid);
		this.dropManager.create(
			this.scene,
			this.grid.grid,
			this.field.field,
			cellSizeX,
			cellSizeY
		);
		this.score.create(this.scene, this.field.field);
		this.story.create(this.scene);

		this.addEvents();
	}

	addEvents() {
		this.events.on("grid-swap", (from, to) => {
			this.grid.swap(from, to);
			this.animationManager.animateSwap(from, to, { check: true });
		});

		this.events.on("check-match", ({ from, to }) => {
			const matched = this.checkManager.checkMatch(from, to);
			if (matched.length) {
				this.board.playSound(true);
				const removed = this.dropManager.removeMatches(matched);
				this.animationManager.removeChips(removed);
			} else {
				this.board.playSound(false);
				this.grid.swap(to, from);
				this.animationManager.animateSwap(to, from, { check: false });
			}
		});

		this.events.on("chips-removed", (chipSprites) => {
			this.events.emit("update-sprites", chipSprites);

			this.time.delayedCall(50, () => {
				const drops = this.dropManager.dropChips();

				this.animationManager.animateDrop(drops).then(() => {
					this.events.emit(
						"update-sprites",
						this.animationManager.chipSprites
					);

					this.time.delayedCall(50, () => {
						const newMatches = this.checkManager.checkAllMatches();
						if (newMatches.length) {
							this.board.playSound(true);
							const removed =
								this.dropManager.removeMatches(newMatches);
							this.animationManager.removeChips(removed);
						}
					});

					this.events.emit("update-animation", false);
				});
			});
		});
	}

	onResize() {
		if (this.field) {
			this.field.onResize();
			this.board.onResize();
			this.animationManager.onResize();
			this.dropManager.onResize();
		}

		this.score.onResize();
		this.story.onResize();
	}

	destroy() {
		this.group.destroy(true);
		this.score.destroy();
	}
}
