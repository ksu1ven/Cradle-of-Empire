export default class NextButton {
	constructor() {
		this.width = 300;
		this.height = 100;
	}

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

		this.load.audio("clickSound", "/assets/sound/click56.mp3");
	}

	create() {
		const points = [
			0.9 * this.width,
			0,
			1.0 * this.width,
			0.5 * this.height,
			0.9 * this.width,
			1.0 * this.height,
			0,
			1.0 * this.height,
			0.1 * this.width,
			0.5 * this.height,
			0,
			0,
		];

		this.polygon = new Phaser.Geom.Polygon(points);

		this.geometry = this.add.graphics({
			fillStyle: { color: 0x0086b0 },
		});
		this.geometry.fillPoints(this.polygon.points, true);

		this.button = this.add.text(0, 0, "NEXT STAGE", {
			fontSize: "32px",
			fontWeight: 600,
			fontFamily: '"Raleway", sans-serif',
			color: "#ffffff",
			align: "center",
			padding: {
				left: 50,
				right: 50,
				top: 32.5,
				bottom: 32.5,
			},
		});
		this.button.setInteractive({ useHandCursor: true });

		this.buttonGroup = this.add.group();
		this.buttonGroup.addMultiple([this.geometry, this.button]);
		this.buttonGroup.setXY(this.scale.width - 350, this.scale.height - 200);

		this.addEvents();
	}

	addEvents() {
		this.button.on("pointerdown", () => {
			this.sound.play("clickSound", { volume: 1 });
			this.events.emit("next-button-clicked");
		});

		this.button.on("pointerover", () => {
			this.geometry.clear();
			this.geometry.fillStyle(0xffe602, 1);
			this.geometry.fillPoints(this.polygon.points, true);
			this.button.setColor("#0086b0");
		});

		this.button.on("pointerout", () => {
			this.geometry.clear();
			this.geometry.fillStyle(0x0086b0, 1);
			this.geometry.fillPoints(this.polygon.points, true);
			this.button.setColor("#ffffff");
		});

		this.input.on("pointerdown", () => {
			this.events.emit("reset-idle-timers");
		});
		this.input.on("pointermove", () => {
			this.events.emit("reset-idle-timers");
		});
	}

	onResize() {
		this.buttonGroup.setXY(this.scale.width - 350, this.scale.height - 200);
	}
}
