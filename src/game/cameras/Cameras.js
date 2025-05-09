export default class Cameras {
	bindVars(scene) {
		this.cameras = scene.cameras;
		this.children = scene.children;
		this.scale = scene.scale;
	}

	addWorldObject(obj) {
		const uiCamera = this.cameras.cameras[1];
		if (uiCamera) uiCamera.ignore(obj);
	}

	addUICamera(scene, ignoreObjects) {
		this.bindVars(scene);

		this.uiCamera = this.cameras.add(
			0,
			0,
			this.scale.width,
			this.scale.height
		);

		this.cameras.main.ignore(ignoreObjects);

		this.uiCamera.ignore(
			this.children.list.filter((obj) => !ignoreObjects.includes(obj))
		);
	}
}
