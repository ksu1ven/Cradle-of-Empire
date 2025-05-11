import Buildings from "../../elements/Buildings";

export default class Match3Story {
	constructor() {
		this.score = 0;

		this.buildings = new Buildings();
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.scale = scene.scale;
		this.events = scene.events;
		this.sound = scene.sound;
		this.tweens = scene.tweens;
		this.time = scene.time;
	}

	preload(scene) {
		this.bindVars(scene);

		this.buildings.preload(this);

		this.load.image("help", "/assets/img/dop/help_2.png");
		this.load.image("whatToBuild", "/assets/img/dop/what_to_build_2.png");
		this.load.image("good", "/assets/img/dop/good.png");
	}

	create(scene, board) {
		this.bindVars(scene);

		this.board = board;
		this.group = this.add.group();

		this.showStoryTextImage("help");

		this.time.delayedCall(1500, () => {
			this.buildings.create(scene, this.group, this.board);
		});

		this.addEvents();
	}

	showStoryTextImage(imageKey) {
		this.textImage = this.add
			.image(this.scale.width / 2, this.scale.height / 2, imageKey)
			.setOrigin(0.5)
			.setDepth(5)
			.setScale(0.9)
			.setAlpha(0);
		this.events.emit("new-object", this.textImage);
		this.group.add(this.textImage);

		this.tweens.add({
			targets: this.textImage,
			alpha: 1,
			duration: 500,
			ease: "Power1",
			hold: 1000,
			yoyo: true,
			onComplete: () => {
				this.textImage.destroy();
			},
		});
	}

	addEvents() {
		this.events.on("update-score", (newScore) => {
			this.score += newScore;
			if (this.score >= 1000 && !this.firstbuildingFinished) {
				this.showStoryTextImage("good");
				this.buildings.finishBuilding("building");
				this.firstbuildingFinished = true;
			}

			if (this.score >= 2000 && !this.secondbuildingFinished) {
				this.showStoryTextImage("whatToBuild");
				this.buildings.finishBuilding("pyramid");
				this.secondbuildingFinished = true;
			}
		});
	}

	onResize() {
		this.buildings.onResize();

		if (this.textImage) {
			this.textImage.setPosition(
				this.scale.width / 2,
				this.scale.height / 2
			);
		}
	}

	destroy() {
		this.group.destroy(true);
	}
}
