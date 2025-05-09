import MainScene from "./scenes/MainScene";
import { AUTO, Game } from "phaser";

const config = {
	type: AUTO,
	width: 1024,
	height: 768,
	parent: "game-container",
	backgroundColor: "#028af8",
	scale: {
		mode: Phaser.Scale.EXPAND,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	dom: {
		createContainer: true,
	},
	scene: [MainScene],
};

const StartGame = (parent) => {
	return new Game({ ...config, parent });
};

export default StartGame;
