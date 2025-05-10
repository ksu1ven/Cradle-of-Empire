export default class Match3CheckManager {
	constructor() {}

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

	sameType(a, b) {
		const chipA = this.grid[a.y][a.x];
		const chipB = this.grid[b.y][b.x];
		return chipA && chipB && chipA.type === chipB.type;
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

		return matched;
	}
}
