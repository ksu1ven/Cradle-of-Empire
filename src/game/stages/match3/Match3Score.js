export default class Match3Score {
	constructor() {
		this.score = 0;
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.events = scene.events;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("scorePlate", "/assets/img/dop/bubble_blue.png");
	}

	create(scene, board) {
		this.bindVars(scene);

		this.board = board;

		this.group = this.add.group();

		this.scorePlate = this.scene.add
			.image(0, 0, "scorePlate")
			.setRotation(Math.PI / 4)
			.setDepth(100)
			.setOrigin(1, 0);

		this.events.emit("new-object", this.scorePlate);

		this.scoreText = this.add
			.text(0, 0, this.score, {
				fontSize: "32px",
				fontWeight: 600,
				fontFamily: '"Raleway", sans-serif',
				color: "#ffffff",
			})
			.setDepth(100)
			.setOrigin(0.5);
		this.events.emit("new-object", this.scoreText);

		this.onResize();

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

		const scale = this.board.scale * 0.8;

		const positionX = boardBounds.x + boardBounds.width + 20 * scale;
		const positionY = boardBounds.y - 70 * scale;

		this.scorePlate.setPosition(positionX, positionY);
		this.scorePlate.setScale(scale);

		this.scoreText.setPosition(positionX - 90 * scale, positionY);
		this.scoreText.setScale(scale * 1.5);
	}

	destroy() {
		this.group.destroy(true);
	}
}
