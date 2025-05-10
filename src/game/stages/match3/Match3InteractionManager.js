export default class Match3InteractionManager {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.selected = null;
		this.isAnimating = false;
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

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				const sprite = this.chipSprites[y][x];
				if (!sprite || this.grid[y][x].disabled) continue;

				sprite.on("pointerdown", (pointer) => {
					this.startPos = { x: pointer.x, y: pointer.y };
					this.selected = { x, y };
				});

				sprite.on("pointerup", (pointer) => {
					if (!this.startPos || !this.selected) return;
					const dx = pointer.x - this.startPos.x;
					const dy = pointer.y - this.startPos.y;

					const direction = this.getSwipeDirection(dx, dy);
					if (direction) this.trySwap(direction);
				});
			}
		}

		this.addEvents();
	}

	addEvents() {
		this.events.on("update-grid", (grid) => {
			this.grid = grid;
		});
		this.events.on("update-sprites", (sprites) => {
			this.chipSprites = sprites;
		});
		this.events.on("update-animation", (isAnimating) => {
			this.isAnimating = isAnimating;
		});
	}

	getSwipeDirection(dx, dy) {
		const threshold = 10;
		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > threshold) return { x: 1, y: 0 };
			else if (dx < -threshold) return { x: -1, y: 0 };
		} else {
			if (dy > threshold) return { x: 0, y: 1 };
			else if (dy < -threshold) return { x: 0, y: -1 };
		}
		return null;
	}

	trySwap(direction) {
		if (this.isAnimating) return;
		this.from = this.selected;
		this.to = {
			x: this.from.x + direction.x,
			y: this.from.y + direction.y,
		};

		if (
			this.to.x < 0 ||
			this.to.x >= this.cols ||
			this.to.y < 0 ||
			this.to.y >= this.rows ||
			this.grid[this.to.y][this.to.x].disabled
		) {
			this.reset();
			return;
		}

		this.isAnimating = true;

		this.events.emit("grid-swap", this.from, this.to);

		this.reset();
	}

	reset() {
		this.startPos = null;
		this.selected = null;
	}
}
