export default class Preloader {
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

	create(scene) {
		this.bindVars(scene);

		const { width, height } = this.scale;

		this.progressBox = this.add.graphics();
		this.progressBar = this.add.graphics();

		this.progressBox.fillStyle(0xffe602, 0.8);
		this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

		this.loadingText = this.add
			.text(width / 2, height / 2 - 50, "ЗАГРУЗКА...", {
				fontSize: "32px",
				fontWeight: 600,
				fontFamily: '"Raleway", sans-serif',
				color: "#ffffff",
			})
			.setOrigin(0.5, 0.5);

		this.load.on("progress", (value) => {
			this.progressBar.clear();
			this.progressBar.fillStyle(0x0086b0, 1);
			this.progressBar.fillRect(
				width / 2 - 150,
				height / 2 - 15,
				300 * value,
				30
			);
		});

		this.load.on("complete", () => {
			this.progressBar.destroy();
			this.progressBox.destroy();
			this.loadingText.destroy();

			if (typeof window.playableLoaded === "function") {
				window.playableLoaded();
			}
		});
	}
}
