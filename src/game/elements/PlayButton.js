export default class PlayButton {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.cameras = scene.cameras;
		this.scale = scene.scale;
		this.sound = scene.sound;
		this.events = scene.events;
		this.input = scene.input;
		this.sys = scene.sys;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("playButton", "/assets/img/bt_play.png");
	}

	create() {
		this.button = this.add
			.image(160, 240, "playButton")
			.setScale(1.2)
			.setInteractive()
			.setScrollFactor(0);

		this.addEvents();
	}

	addEvents() {
		this.button.on("pointerdown", () => {
			this.redirectToStore();
		});
	}

	redirectToStore() {
		const os = this.sys.game.device.os;
		const storeUrl = os.android
			? "https://play.google.com/store/apps/details?id=com.awem.cradleofempires.andr&hl=en"
			: "https://apps.apple.com/us/app/cradle-of-empires-match-3-game/id738480930";
		window.open(storeUrl, "_blank");
	}
}
