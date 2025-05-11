export default class SpineObjectStage {
	constructor() {
		this.fireworkFrames = 29;
		this.volley = 5;
		this.volleyMaxDistanceFromCenterX = 150;
		this.volleyMaxDistanceFromCenterY = 100;
		this.lastAngle = null;
		this.girlWidth = 1024;
		this.girlHeight = 1024;
	}

	bindVars(scene) {
		this.scene = scene;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.anims = scene.anims;
		this.time = scene.time;
		this.load = scene.load;
		this.sound = scene.sound;
		this.events = scene.events;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.spine(
			"greengirl",
			"/assets/anim/green_girl/green_girl.json",
			["/assets/anim/green_girl/green_girl.atlas"],
			true
		);

		for (let i = 0; i <= this.fireworkFrames; i++) {
			const index = i.toString().padStart(5, "0");
			this.load.image(
				`fireworks_${index}`,
				`/assets/anim/fireworks_1/fireworks_${index}.png`
			);
		}

		this.load.audio("fireworkSound", "/assets/sound/salut56.mp3");
		this.load.audio("fineSound", "/assets/sound/fine56.mp3");
	}

	createStage(scene) {
		this.bindVars(scene);

		this.sound.play("fineSound", { volume: 1 });

		const scaleX = (this.scale.width / this.girlWidth / 1.5) * 0.6;
		const scaleY = this.scale.height / this.girlHeight / 1.5;

		this.finalScale = Math.max(scaleX, scaleY) * 0.6;

		this.spineObject = this.add.spine(
			this.scale.width / 2,
			this.scale.height / 2 + 350 * this.finalScale,
			"greengirl",
			"animation",
			true
		);
		this.spineObject.setScale(this.finalScale);
		this.events.emit("new-object", this.spineObject);
	}

	createFireworkAnimation() {
		const frames = [];
		for (let i = 0; i <= this.fireworkFrames; i++) {
			const index = i.toString().padStart(5, "0");
			frames.push({ key: `fireworks_${index}` });
		}

		this.anims.create({
			key: "fireworksAnimation",
			frames,
			frameRate: 15,
			repeat: 0,
		});
	}

	spawnFirework() {
		let angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

		if (this.lastAngle && this.lastAngle < Math.PI && angle < Math.PI)
			angle += Math.PI;

		if (this.lastAngle && this.lastAngle > Math.PI && angle > Math.PI)
			angle -= Math.PI;

		this.lastAngle = angle;

		const radiusX = this.volleyMaxDistanceFromCenterX;
		const radiusY = this.volleyMaxDistanceFromCenterY;

		const centerX = this.scale.width / 2;
		const centerY = this.scale.height / 2 - 600 * this.finalScale;

		const x = centerX + Math.cos(angle) * radiusX;
		const y = centerY + Math.sin(angle) * radiusY;

		const scale = Phaser.Math.FloatBetween(
			1.5 * this.finalScale,
			2 * this.finalScale
		);

		const sprite = this.scene.add.sprite(x, y, "firework");

		sprite.setScale(scale);
		this.events.emit("new-object", sprite);
		sprite.play({ key: "fireworksAnimation", hideOnComplete: true });
		this.sound.play("fireworkSound", { volume: 1 });
		sprite.on("animationcomplete", () => {
			sprite.destroy();
		});
	}

	startFireworkAnimation() {
		if (!this.anims.exists("fireworksAnimation"))
			this.createFireworkAnimation();

		this.cameras.main.zoomTo(1, 1000);

		this.spawnFirework();

		this.time.addEvent({
			delay: 500,
			repeat: this.volley - 2,
			callback: this.spawnFirework,
			callbackScope: this,
		});

		if (typeof window.playableFinished === "function") {
			window.playableFinished();
		}
	}

	onResize() {
		if (this.spineObject) {
			const scaleX = (this.scale.width / this.girlWidth / 1.5) * 0.6;
			const scaleY = this.scale.height / this.girlHeight / 1.5;

			this.finalScale = Math.max(scaleX, scaleY) * 0.6;

			this.spineObject.setScale(this.finalScale);
			this.spineObject.setPosition(
				this.scale.width / 2,
				this.scale.height / 2 + 350 * this.finalScale
			);
		}
	}
}
