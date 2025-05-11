export default class Match3AnimationManager {
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

	create(scene, board, chipSprites, group, cellSizeX, cellSizeY) {
		this.bindVars(scene);

		this.board = board;
		this.chipSprites = chipSprites;
		this.group = group;
		this.cellSizeX = cellSizeX;
		this.cellSizeY = cellSizeY;
	}

	addEvents() {
		this.events.on("update-sprites", (sprites) => {
			this.chipSprites = sprites;
		});
		this.events.on("match-fail", () => {
			setTimeout(() => {
				this.animateSwap(this.to, this.from);
				this.events.emit("grid-swap", this.to, this.from);
			}, 500);
		});
	}

	removeChips(positions) {
		let completed = 0;

		positions.forEach(({ x, y }) => {
			const sprite = this.chipSprites[y][x];

			if (sprite) {
				this.scene.tweens.add({
					targets: sprite,
					alpha: 0,
					duration: 300,
					onComplete: () => {
						sprite.destroy();
						this.chipSprites[y][x] = null;

						completed++;

						if (completed === positions.length) {
							this.events.emit("chips-removed", this.chipSprites);
						}
					},
				});
			}
		});
	}

	async animateDrop(drops) {
		const oldChips = drops.filter(({ sprite }) => sprite && !sprite.new);

		const newChips = drops.filter(({ sprite }) => sprite && sprite.new);

		const animateGroup = (group) => {
			const groupPromises = [];

			group.forEach(({ sprite, from, to }) => {
				if (sprite.new) {
					const chip = this.scene.add
						.image(sprite.x, sprite.y, sprite.type)
						.setScale(sprite.scale)
						.setDepth(sprite.depth)
						.setInteractive({ useHandCursor: true });

					this.events.emit("new-object", chip);
					this.group.add(chip);
					this.chipSprites[to.y][to.x] = chip;

					sprite = chip;
				}

				const distance = (to.y - from.y) * this.cellSizeY;

				const promise = new Promise((resolve) => {
					this.scene.tweens.add({
						targets: sprite,
						y: sprite.new ? sprite.targetY : sprite.y + distance,
						duration: 200,
						ease: "Cubic.easeIn",
						onComplete: () => resolve(),
					});
				});

				groupPromises.push(promise);
			});

			return Promise.all(groupPromises);
		};

		return animateGroup(oldChips).then(() => animateGroup(newChips));
	}

	animateSwap(from, to, options) {
		const a = this.chipSprites[from.y][from.x];
		const b = this.chipSprites[to.y][to.x];

		const tweenA = new Promise((resolve) => {
			this.tweens.add({
				targets: a,
				x: b.x,
				y: b.y,
				duration: 500,
				onComplete: resolve,
			});
		});

		const tweenB = new Promise((resolve) => {
			this.tweens.add({
				targets: b,
				x: a.x,
				y: a.y,
				duration: 500,
				onComplete: resolve,
			});
		});

		Promise.all([tweenA, tweenB]).then(() => {
			this.chipSprites[from.y][from.x] = b;
			this.chipSprites[to.y][to.x] = a;

			this.events.emit("update-sprites", this.chipSprites);

			if (options.check) {
				this.events.emit("check-match", { from, to });
			} else {
				this.events.emit("update-animation", false);
			}
		});
	}

	onResize() {
		this.cellSizeX = (this.board.width * 0.9 - 2) / 7;
		this.cellSizeY = (this.board.height * 0.9 - 2) / 7;
	}
}
