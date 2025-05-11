import Phaser from "phaser";
import Match3Stage from "../stages/Match3Stage";
import SpineObjectStage from "../stages/SpineObjectStage";

import Preloader from "../elements/Preloader";
import Logo from "../elements/Logo";
import NextButton from "../elements/NextButton";
import WhiteHand from "../elements/WhiteHand";
import Background from "../elements/Background";
import PlayButton from "../elements/PlayButton";

import Cameras from "../cameras/Cameras";

export default class MainScene extends Phaser.Scene {
	constructor() {
		super({
			pack: {
				files: [
					{
						type: "scenePlugin",
						key: "SpinePlugin",
						url: "/plugins/SpinePlugin.js",
						sceneKey: "spine",
					},
				],
			},
		});
		this.stageIndex = 0;
		this.cameraClass = new Cameras();

		this.preloader = new Preloader();
		this.background = new Background();
		this.logo = new Logo();
		this.playButton = new PlayButton();
		this.nextButton = new NextButton();
		this.whiteHand = new WhiteHand();

		this.math3stage = new Match3Stage();
		this.spineObjectStage = new SpineObjectStage();

		this.loadedStages = 0;
	}

	preload() {
		this.preloader.create(this);

		this.background.preload(this);
		this.logo.preload(this);
		this.playButton.preload(this);
		this.nextButton.preload(this);
		this.whiteHand.preload(this);

		this.load.once("complete", () => {
			this.math3stage.preload(this);
			this.loadedStages = 1;
			console.log("common-assets-loaded");

			this.load.start();

			this.load.once("complete", () => {
				console.log("match-3-loaded");
				this.loadedStages = 2;
				this.spineObjectStage.preload(this);
				this.load.start();

				this.load.on("complete", () => {
					console.log("spin-loaded");
					this.loadedStages = 3;
					if (typeof window.playableLoaded === "function") {
						window.playableLoaded();
					}
				});
			});
		});
	}

	create() {
		this.background.create();
		this.logo.create();
		this.playButton.create();
		this.nextButton.create();

		this.whiteHand.createWhiteHandAnimation();
		this.whiteHand.setNextButton(this.nextButton.button);
		this.whiteHand.resetIdleTimers();

		this.cameraClass.addUICamera(this, [
			this.logo.logo,
			this.playButton.button,
			this.nextButton.button,
			this.nextButton.geometry,
		]);

		this.addEvents();

		this.scale.on("resize", this.onResize, this);

		if (typeof window.playableStarted === "function") {
			window.playableStarted();
		}
	}

	addEvents() {
		this.events.on("next-button-clicked", () => {
			this.changeStage();
		});
		this.events.on("reset-idle-timers", () => {
			this.whiteHand.resetIdleTimers();
		});
		this.events.on("new-object", (obj) => {
			this.cameraClass.addWorldObject(obj);
		});
	}

	changeStage() {
		switch (this.stageIndex) {
			case 0:
				if (this.loadedStages >= 2) {
					this.nextButton.hideWithFade();
					this.stageIndex += 1;
					this.math3stage.createStage(this);
					this.time.delayedCall(1500, () => {
						this.nextButton.showWithFade();
					});
				}

				break;

			case 1:
				if (this.loadedStages === 3) {
					this.nextButton.hideWithFade();
					this.stageIndex += 1;
					this.math3stage.destroy();
					this.spineObjectStage.createStage(this);
					this.time.delayedCall(1500, () => {
						this.nextButton.showWithFade();
					});
				}

				break;

			default:
				this.nextButton.hideWithFade();
				this.spineObjectStage.startFireworkAnimation();
				this.time.delayedCall(3000, () => {
					this.nextButton.showWithFade();
				});
				break;
		}
	}

	onResize(gameSize) {
		this.background.onResize(gameSize);
		this.nextButton.onResize();
		this.whiteHand.onResize();

		this.math3stage.onResize();
		this.spineObjectStage.onResize();
	}
}
