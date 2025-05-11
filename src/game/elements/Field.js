export default class Field {
	bindVars(scene) {
		this.scene = scene;
		this.load = scene.load;
		this.add = scene.add;
		this.scale = scene.scale;
		this.events = scene.events;
	}

	preload(scene) {
		this.bindVars(scene);

		this.load.image("field", "/assets/img/field_1_vertical.png");
	}

	create(scene, group) {
		this.bindVars(scene);
		this.group = group;

		this.field = this.scene.add
			.image(this.scale.width / 2, this.scale.height / 2, "field")
			.setDepth(3);

		const texture = this.scene.textures.get("field");
		const frame = texture.getSourceImage();

		this.imageWidth = frame.width;
		this.imageHeight = frame.height;

		this.onResize();

		this.events.emit("new-object", this.field);
		this.group.add(this.field);
	}

	onResize() {
		if (this.field) {
			this.field.setPosition(this.scale.width / 2, this.scale.height / 2);

			const scaleX = (this.scale.width / this.imageWidth / 1.5) * 0.7;
			const scaleY = this.scale.height / this.imageHeight / 1.5;

			this.finalScale = Math.max(scaleX, scaleY) * 0.4;

			this.field.setScale(this.finalScale);

			this.cellSizeX = (this.field.width * this.finalScale - 2) / 7;
			this.cellSizeY = (this.field.height * this.finalScale - 2) / 7;
		}
	}
}
