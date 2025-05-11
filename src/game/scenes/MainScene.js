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
						url: "https://cdn.phaserfiles.com/v385/plugins/spine4.1/SpinePluginDebug.js",
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
	}

	preload() {
		this.preloader.create(this);

		this.background.preload(this);
		this.logo.preload(this);
		this.playButton.preload(this);
		this.nextButton.preload(this);
		this.whiteHand.preload(this);

		this.math3stage.preload(this);
		this.spineObjectStage.preload(this);
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
		this.background.onResize(this.scale.gameSize);

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
		this.stageIndex += 1;

		switch (this.stageIndex) {
			case 1:
				this.math3stage.createStage(this);
				break;

			case 2:
				this.math3stage.destroy();
				this.spineObjectStage.createStage(this);
				break;

			default:
				this.spineObjectStage.startFireworkAnimation();
				break;
		}
	}

	onResize(gameSize) {
		this.background.onResize(gameSize);
		this.nextButton.onResize();

		this.math3stage.onResize();
		this.spineObjectStage.onResize();
	}
}
