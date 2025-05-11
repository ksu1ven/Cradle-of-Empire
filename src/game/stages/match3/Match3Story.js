export default class Match3Story {
	constructor() {
		this.score = 0;
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.events = scene.events;
		this.tweens = scene.tweens;
		this.time = scene.time;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("buildingStart", "/assets/img/dop/building_1.png");
		this.load.image("buildingEnd", "/assets/img/dop/building_4.png");
		this.load.image("pyramidStart", "/assets/img/dop/pyramid_3.png");
		this.load.image("pyramidEnd", "/assets/img/dop/pyramid_3.png");

		this.load.image("help", "/assets/img/dop/help_2.png");
		this.load.image("whatToBuild", "/assets/img/dop/what_to_build_2.png");
		this.load.image("good", "/assets/img/dop/good.png");
	}

	create(scene) {
		this.bindVars(scene);

		this.showStoryImage("help");

		this.time.delayedCall(1500, () => {
			this.buildingStart = this.add
				.image(this.scale.width, 0, "buildingStart")
				.setOrigin(1, 0);

			const cam = this.cameras.main;

			cam.ignore(this.buildingStart);
		});

		this.addEvents();
	}

	showStoryImage(imageKey) {
		const image = this.add
			.image(this.scale.width / 2, this.scale.height / 2, imageKey)
			.setOrigin(0.5)
			.setDepth(5)
			.setAlpha(0);
		this.events.emit("new-object", image);

		this.tweens.add({
			targets: image,
			alpha: 1,
			duration: 500,
			ease: "Power1",
			hold: 1500,
			yoyo: true,
			onComplete: () => {
				image.destroy();
			},
		});
	}

	addEvents() {
		this.events.on("update-score", (newScore) => {
			this.score += newScore;
		});
	}

	onResize() {
		if (this.buildingStart) {
			this.buildingStart.setPosition(this.scale.width, 0);
		}
	}
}
