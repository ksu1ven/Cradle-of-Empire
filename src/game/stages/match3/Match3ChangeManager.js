export default class Match3ChangeManager {
	constructor(rows = this.rows, cols = this.rows) {
		this.rows = rows;
		this.cols = cols;
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

	create(scene, grid, chipSprites) {
		this.bindVars(scene);
		this.grid = grid;
		this.chipSprites = chipSprites;

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-grid", (grid) => {
			this.grid = grid;
		});
		this.events.on("update-sprites", (sprites) => {
			this.chipSprites = sprites;
		});
	}

	removeMatches(matches) {
		const unique = new Set(matches.map((m) => `${m.x},${m.y}`));

		for (const key of unique) {
			const [x, y] = key.split(",").map(Number);

			if (this.grid[y] && this.grid[y][x]) {
				this.grid[y][x].type = null;
			}
		}

		this.events.emit("update-grid", this.grid);

		return Array.from(unique).map((key) => {
			const [x, y] = key.split(",").map(Number);
			return { x, y };
		});
	}

	dropChips() {
		const drops = [];

		for (let x = 0; x < this.grid[0].length; x++) {
			let writeY = this.grid.length - 1;

			for (let readY = this.grid.length - 1; readY >= 0; readY--) {
				const cell = this.grid[readY][x];

				if (!cell || cell.disabled) continue;

				if (cell.type !== null) {
					if (writeY !== readY) {
						while (
							writeY > readY &&
							this.grid[writeY][x].disabled
						) {
							writeY--;
						}

						if (writeY !== readY) {
							this.grid[writeY][x].type = cell.type;
							cell.type = null;

							const sprite = this.chipSprites[readY][x];
							this.chipSprites[writeY][x] = sprite;
							this.chipSprites[readY][x] = null;

							drops.push({
								sprite,
								from: { x, y: readY },
								to: { x, y: writeY },
							});
						}
					}

					writeY--;
				}
			}
		}

		this.events.emit("update-grid", this.grid);
		return drops;
	}
}
