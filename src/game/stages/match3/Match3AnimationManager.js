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

	create(scene, chipSprites) {
		this.bindVars(scene);
		this.chipSprites = chipSprites;
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
}
