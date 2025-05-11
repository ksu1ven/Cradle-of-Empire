export default class WhiteHand {
	constructor() {
		this.whiteHandFrames = 24;
	}

	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.anims = scene.anims;
		this.time = scene.time;
	}

	preload(scene) {
		this.bindVars(scene);

		for (let i = 0; i <= this.whiteHandFrames; i++) {
			const index = i.toString().padStart(5, "0");
			this.load.image(
				`whiteHand_${index}`,
				`/assets/anim/White_Hand_Sequence/WhiteHand_${index}.png`
			);
		}
	}

	createWhiteHandAnimation() {
		const frames = [];
		for (let i = 0; i <= this.whiteHandFrames; i++) {
			const index = i.toString().padStart(5, "0");
			frames.push({ key: `whiteHand_${index}` });
		}

		this.anims.create({
			key: "whiteHandAnimation",
			frames,
			frameRate: 15,
			repeat: 0,
		});
	}

	showWhiteHandAnimation() {
		this.whiteHand = this.add
			.sprite(
				this.nextButton.x + 150,
				this.nextButton.y + 120,
				"whiteHand"
			)
			.setScale(0.4)
			.setDepth(2);
		this.whiteHand.play({
			key: "whiteHandAnimation",
			hideOnComplete: true,
		});
	}

	setNextButton(nextButton) {
		this.nextButton = nextButton;
	}

	resetIdleTimers() {
		if (this.whiteHand?.anims.isPlaying) {
			this.whiteHand.anims.stop();
			this.whiteHand.setVisible(false);
		}

		if (this.idleStartTimer) this.idleStartTimer.remove();
		if (this.repeatHintTimer) this.repeatHintTimer.remove();

		this.idleStartTimer = this.time.delayedCall(3000, () => {
			this.showWhiteHandAnimation();
			this.repeatHintTimer = this.time.addEvent({
				delay: 5000,
				loop: true,
				callback: () => {
					this.showWhiteHandAnimation(
						this.nextButton.x + 150,
						this.nextButton.y + 120
					);
				},
			});
		});
	}

	onResize() {
		if (this.whiteHand) {
			this.resetIdleTimers();
		}
	}
}
