export default class Match3Grid {
	constructor(rows = 7, cols = 7, disabledCoords) {
		this.rows = rows;
		this.cols = cols;
		this.disabledCoords = disabledCoords;
		this.grid = [];

		this.disabledMap = this.getDisabledMap();
	}

	bindVars(scene) {
		this.scene = scene;
		this.events = scene.events;
	}

	getDisabledMap() {
		const map = [];

		for (let y = 0; y < this.rows; y++) {
			const row = [];
			for (let x = 0; x < this.cols; x++) {
				const isDisabled = this.disabledCoords.some(
					(coord) => coord.x === x && coord.y === y
				);
				row.push(isDisabled);
			}
			map.push(row);
		}

		return map;
	}

	create(scene) {
		this.bindVars(scene);

		for (let y = 0; y < this.rows; y++) {
			const row = [];
			for (let x = 0; x < this.cols; x++) {
				const isDisabled = this.disabledMap[y][x];

				let type = null;
				if (!isDisabled) {
					type = this.getSafeRandomType(x, y, row);
				}

				row.push({
					x,
					y,
					disabled: isDisabled,
					type,
				});
			}
			this.grid.push(row);
		}

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-grid", (grid) => {
			this.grid = grid;
		});
	}

	getSafeRandomType(x, y, currentRow) {
		const types = ["blue", "green", "pink", "red", "yellow"];

		const left1 = x > 0 ? currentRow[x - 1]?.type : null;
		const left2 = x > 1 ? currentRow[x - 2]?.type : null;
		if (left1 && left1 === left2) {
			const index = types.indexOf(left1);
			if (index !== -1) types.splice(index, 1);
		}

		const top1 = y > 0 ? this.grid[y - 1]?.[x]?.type : null;
		const top2 = y > 1 ? this.grid[y - 2]?.[x]?.type : null;
		if (top1 && top1 === top2) {
			const index = types.indexOf(top1);
			if (index !== -1) types.splice(index, 1);
		}

		return types[Math.floor(Math.random() * types.length)];
	}

	swap(from, to) {
		const fromCell = this.grid[from.y]?.[from.x];
		const toCell = this.grid[to.y]?.[to.x];

		if (!fromCell || !toCell || fromCell.disabled || toCell.disabled)
			return;

		const tempType = fromCell.type;
		fromCell.type = toCell.type;
		toCell.type = tempType;

		this.events.emit("update-grid", this.grid);
	}
}
