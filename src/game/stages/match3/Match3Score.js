export default class Match3Score {
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
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("scorePlate", "/assets/img/dop/bubble_blue.png");
	}

	create(scene, board) {
		this.bindVars(scene);

		this.board = board;
		const boardBounds = this.board.getBounds();

		const positionX = boardBounds.x + boardBounds.width + 35;
		const positionY = boardBounds.y - 35;

		this.group = this.add.group();

		this.scorePlate = this.scene.add
			.image(positionX, positionY, "scorePlate")
			.setRotation(Math.PI / 4)
			.setDepth(100)
			.setScale(0.7);
		this.events.emit("new-object", this.scorePlate);

		this.scoreText = this.add
			.text(positionX + 4, positionY - 5, this.score, {
				fontSize: "32px",
				fontWeight: 600,
				fontFamily: '"Raleway", sans-serif',
				color: "#ffffff",
			})
			.setDepth(100)
			.setOrigin(0.5, 0.5);

		this.events.emit("new-object", this.scoreText);

		this.group.addMultiple([this.scorePlate, this.scoreText]);

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-score", (newScore) => {
			this.score += newScore;
			this.scoreText.setText(this.score);
		});
	}

	onResize() {
		const boardBounds = this.board.getBounds();

		const positionX = boardBounds.x + boardBounds.width + 35;
		const positionY = boardBounds.y - 35;

		this.scorePlate.setPosition(positionX, positionY);
		this.scoreText.setPosition(positionX + 4, positionY - 5);
	}

	destroy() {
		this.group.destroy();
	}
}
