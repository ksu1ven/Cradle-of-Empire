export default class Match3CheckManager {
	constructor() {}

	bindVars(scene) {
		this.scene = scene;
		this.events = scene.events;
	}

	create(scene, grid) {
		this.bindVars(scene);
		this.grid = grid;

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-grid", (grid) => {
			this.grid = grid;
		});
	}

	isValid(x, y) {
		return (
			y >= 0 &&
			y < this.grid.length &&
			x >= 0 &&
			x < this.grid[0].length &&
			this.grid[y][x] !== null
		);
	}

	sameType(pos1, pos2) {
		const a = this.grid[pos1.y]?.[pos1.x];
		const b = this.grid[pos2.y]?.[pos2.x];
		if (!a || !b) return false;
		if (!a.type || !b.type) return false;
		if (a.disabled || b.disabled) return false;
		return a.type === b.type;
	}

	findLocalMatches(pos) {
		const directions = [
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
		];

		const matched = [];

		for (const { dx, dy } of directions) {
			let line = [pos];

			for (let i = 1; i < 4; i++) {
				const x = pos.x + dx * i;
				const y = pos.y + dy * i;
				if (!this.isValid(x, y)) break;
				if (!this.sameType(pos, { x, y })) break;
				line.push({ x, y });
			}

			for (let i = 1; i < 4; i++) {
				const x = pos.x - dx * i;
				const y = pos.y - dy * i;
				if (!this.isValid(x, y)) break;
				if (!this.sameType(pos, { x, y })) break;
				line.push({ x, y });
			}

			if (line.length >= 3) {
				matched.push(...line);
			}
		}

		return matched;
	}

	checkMatch(from, to) {
		const matched = [
			...this.findLocalMatches(from),
			...this.findLocalMatches(to),
		];

		if (matched?.length) {
			this.events.emit("update-score", matched.length * 100);
		}

		return matched;
	}

	checkAllMatches() {
		const matched = [];
		const visited = new Set();

		for (let y = 0; y < this.grid.length; y++) {
			for (let x = 0; x < this.grid[0].length; x++) {
				const pos = { x, y };
				const localMatches = this.findLocalMatches(pos);

				for (const match of localMatches) {
					const key = `${match.x},${match.y}`;
					if (!visited.has(key)) {
						visited.add(key);
						matched.push(match);
					}
				}
			}
		}

		if (matched?.length) {
			this.events.emit("update-score", matched.length * 100);
		}

		return matched;
	}
}
