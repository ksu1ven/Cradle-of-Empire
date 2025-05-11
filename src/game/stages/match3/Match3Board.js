export default class Match3Board {
	constructor(rows = this.rows, cols = this.rows) {
		this.rows = rows;
		this.cols = cols;
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.sound = scene.sound;
		this.events = scene.events;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image(`ch_blue`, "/assets/img/ch_blue.png");
		this.load.image(`ch_green`, "/assets/img/ch_green.png");
		this.load.image(`ch_pink`, "/assets/img/ch_pink.png");
		this.load.image(`ch_red`, "/assets/img/ch_red.png");
		this.load.image(`ch_yellow`, "/assets/img/ch_yellow.png");

		this.load.audio("failSound", "/assets/sound/mistake56.mp3");
		this.load.audio("matchSound", "/assets/sound/match56.mp3");
	}

	create(scene, grid, group, board, cellSizeX, cellSizeY) {
		this.bindVars(scene);
		this.grid = grid;
		this.group = group;
		this.board = board;
		this.cellSizeX = cellSizeX;
		this.cellSizeY = cellSizeY;

		const boardBounds = this.board.getBounds();

		this.chipSprites = [];

		for (let y = 0; y < this.rows; y++) {
			const row = [];
			for (let x = 0; x < this.cols; x++) {
				const cell = this.getCell(x, y);

				if (!cell || cell.disabled) {
					row.push(null);
					continue;
				}

				const color = cell.type;
				const positionX =
					boardBounds.x + cell.x * cellSizeX + cellSizeX / 2;
				const positionY =
					boardBounds.y + cell.y * cellSizeY + cellSizeY / 2;

				const chip = this.scene.add
					.image(positionX, positionY, `ch_${color}`)
					.setScale(this.board.scale * 0.8)
					.setDepth(4)
					.setInteractive({ useHandCursor: true });

				this.events.emit("new-object", chip);
				this.group.add(chip);
				row.push(chip);
			}
			this.chipSprites.push(row);
		}

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-sprites", (sprites) => {
			this.chipSprites = sprites;
		});
	}

	playSound(match) {
		setTimeout(() => {
			this.sound.play(match ? "matchSound" : "failSound", {
				volume: 1,
			});
		}, 250);
	}

	getCell(x, y) {
		if (y < 0 || y >= this.rows || x < 0 || x >= this.cols) return null;
		return this.grid[y][x];
	}

	onResize() {
		const boardBounds = this.board.getBounds();

		this.cellSizeX = (this.board.width * this.board.scale - 2) / 7;
		this.cellSizeY = (this.board.height * this.board.scale - 2) / 7;

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const chip = this.chipSprites[y]?.[x];
				const cell = this.getCell(x, y);
				if (chip && cell) {
					const newX =
						boardBounds.x + x * this.cellSizeX + this.cellSizeX / 2;
					const newY =
						boardBounds.y + y * this.cellSizeY + this.cellSizeY / 2;
					chip.setPosition(newX, newY).setScale(
						this.board.scale * 0.8
					);
				}
			}
		}
	}
}
