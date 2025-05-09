export default class Match3Stage {
	constructor() {}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
	}

	preload(scene) {
		this.bindVars(scene);
		this.load.image("field", "/assets/img/field_1_vertical.png");
		this.load.audio("cameraSound", "/assets/sound/camera56.mp3");
	}

	addWorldObject(obj) {
		const uiCamera = this.cameras.cameras[1];
		uiCamera && uiCamera.ignore(obj);
		return obj;
	}

	createWhiteHandAnimation() {
		const frames = [];
		for (let i = 0; i <= this.whiteHandFrames; i++) {
			const index = i.toString().padStart(5, "0");
			frames.push({ key: `whiteHand_${index}` });
		}

		this.anims.create({
			key: "whiteHand",
			frames,
			frameRate: 15,
			repeat: 0,
		});
	}

	createStage(scene) {
		console.log("create");
		this.bindVars(scene);

		this.container = this.add.container();
		this.field = this.addWorldObject(
			this.scene.add.image(
				this.scale.width / 2,
				this.scale.height / 2,
				"field"
			)
		);
		this.container.add(this.field);

		this.sound.play("cameraSound", { volume: 1 });
		this.cameras.main.zoomTo(1.5, 1000);
	}

	onResize() {
		if (this.field) {
			this.field.setPosition(this.scale.width / 2, this.scale.height / 2);
		}
	}

	destroy() {
		this.container.destroy(true);
	}
}
