import Match3Grid from "./match3/Match3Grid";
import Match3Board from "./match3/Match3Board";
import Match3InteractionManager from "./match3/Match3InteractionManager";
import Match3AnimationManager from "./match3/Match3AnimationManager";

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
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.events = scene.events;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("field", "/assets/img/field_1_vertical.png");
		this.load.audio("cameraSound", "/assets/sound/camera56.mp3");

		this.board.preload(scene);
	}

	createStage(scene) {
		this.bindVars(scene);

		this.group = this.add.group();

		this.field = this.scene.add.image(
			this.scale.width / 2,
			this.scale.height / 2,
			"field"
		);
		this.events.emit("new-object", this.field);
		this.group.add(this.field);

		this.grid.bindVars(scene);

		const cellSizeX = (this.field.width - 2) / 7;
		const cellSizeY = (this.field.height - 2) / 7;
		this.board.create(
			this.grid.grid,
			this.group,
			this.field,
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
		this.animationManager.create(this.scene, this.board.chipSprites);

		this.addEvents();
	}

	addEvents() {
		this.events.on("grid-swap", (from, to) => {
			this.grid.swap(from, to);
			this.animationManager.animateSwap(from, to, { check: true });
		});

		this.events.on("check-match", ({ from, to }) => {
			if (!this.grid.checkMatch(from, to)) {
				this.grid.swap(to, from);
				this.animationManager.animateSwap(to, from, { check: false });
			}
		});
	}

	onResize() {
		if (this.field) {
			this.field.setPosition(this.scale.width / 2, this.scale.height / 2);
			this.board.onResize();
		}
	}

	destroy() {
		this.group.destroy(true);
	}
}
