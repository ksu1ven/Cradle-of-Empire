export default class Background {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.anims = scene.anims;
		this.time = scene.time;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("bg", "/assets/img/map.png");
		this.load.audio("bgMusic", "/assets/sound/sound56.mp3");
	}

	create() {
		this.background = this.add
			.image(512, 384, "bg")
			.setDepth(-10)
			.setScrollFactor(1);

		if (!this.sound.get("bgMusic")) {
			const music = this.sound.add("bgMusic", {
				loop: true,
				volume: 0.5,
			});
			music.play();
		}
	}

	onResize(gameSize) {
		const width = gameSize.width;
		const height = gameSize.height;
		const textureWidth = this.background.width;
		const textureHeight = this.background.height;
		const scaleX = width / textureWidth;
		const scaleY = height / textureHeight;
		const scale = Math.max(scaleX, scaleY);
		this.background.setScale(scale);
		this.background.setPosition(width / 2, height / 2);
	}
}
