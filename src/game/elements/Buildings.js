export default class Buildings {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.scale = scene.scale;
		this.events = scene.events;
		this.tweens = scene.tweens;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("buildingStart", "/assets/img/dop/building_1.png");
		this.load.image("buildingEnd", "/assets/img/dop/building_4.png");
		this.load.image("pyramidStart", "/assets/img/dop/pyramid_3.png");
		this.load.image("pyramidEnd", "/assets/img/dop/pyramid_4.png");
	}

	create(scene, group, board) {
		this.bindVars(scene);
		this.group = group;
		this.board = board;

		this.building = this.add.image(0, 0, "buildingStart");
		this.events.emit("new-object", this.building);
		this.setBuildingSizes(this.building, "top");

		this.pyramid = this.add.image(0, 0, "pyramidStart");
		this.events.emit("new-object", this.pyramid);
		this.setBuildingSizes(this.pyramid, "bottom");

		this.group.addMultiple([this.building, this.pyramid]);
	}

	finishBuilding(type) {
		const target = type === "building" ? this.building : this.pyramid;
		const targetTexture =
			type === "building" ? "buildingEnd" : "pyramidEnd";

		this.tweens.add({
			targets: target,
			scale: target.scale * 0.5,
			duration: 150,
			ease: "Back.In",
			onComplete: () => {
				target.setTexture(targetTexture);

				this.tweens.add({
					targets: target,
					scale: target.scale / 0.5,
					duration: 200,
					ease: "Bounce.Out",
				});
			},
		});
	}

	setBuildingSizes(object, place) {
		const scaleX = (this.scale.width / 369 / 1.5) * 1.5;
		const scaleY = this.scale.height / 235 / 1.5;

		if (scaleX > scaleY) {
			if (place === "top") object.setOrigin(0, 0);
			else object.setOrigin(1, 1);
		} else {
			if (place === "top") object.setOrigin(1, 1);
			else object.setOrigin(0, 0);
		}

		this.finalScale = Math.max(scaleX, scaleY) * 0.2;

		object.setScale(this.finalScale);

		const boardBounds = this.board.getBounds();

		if (place === "top") {
			const boardXEnd =
				boardBounds.x + boardBounds.width + 70 * this.finalScale;
			const boardYStart = boardBounds.y - 100 * this.finalScale;
			object.setPosition(boardXEnd, boardYStart);
		} else {
			const boardXStart = boardBounds.x - 70 * this.finalScale;
			const boardYEnd =
				boardBounds.y + boardBounds.height + 100 * this.finalScale;
			object.setPosition(boardXStart, boardYEnd);
		}
	}

	onResize() {
		if (this.building) {
			this.setBuildingSizes(this.building, "top");
		}
		if (this.pyramid) {
			this.setBuildingSizes(this.pyramid, "bottom");
		}
	}
}
