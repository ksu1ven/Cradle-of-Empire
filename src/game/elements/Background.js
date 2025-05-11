export default class Background {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.scale = scene.scale;
		this.sound = scene.sound;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("bg", "/assets/img/map.png");
		this.load.audio("bgMusic", "/assets/sound/sound56.mp3");
	}

	create() {
		this.background = this.add
			.image(0, 0, "bg")
			.setDepth(-10)
			.setScrollFactor(1);

		this.textureWidth = this.background.width;
		this.textureHeight = this.background.height;

		this.onResize();

		if (!this.sound.get("bgMusic")) {
			const music = this.sound.add("bgMusic", {
				loop: true,
				volume: 0.5,
			});
			music.play();
		}
	}

	onResize() {
		const scaleX = this.scale.width / this.textureWidth;
		const scaleY = this.scale.height / this.textureHeight;

		const scale = Math.max(scaleX, scaleY);
		this.background.setScale(scale);
		this.background.setPosition(
			this.scale.width / 2,
			this.scale.height / 2
		);
	}
}
