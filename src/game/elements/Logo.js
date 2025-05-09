export default class Logo {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.events = scene.events;
		this.input = scene.input;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("logo", "/assets/img/logo_portrait.png");
	}

	create() {
		this.logo = this.add
			.image(160, 100, "logo")
			.setScale(0.5)
			.setScrollFactor(0);
	}
}
