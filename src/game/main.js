import MainScene from "./scenes/MainScene";
import TESTapi from "./api/test";
import { AUTO, Game } from "phaser";

const config = {
	type: AUTO,
	width: 1024,
	height: 768,
	parent: "game-container",
	backgroundColor: 0x0086b0,
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

new TESTapi();

export default StartGame;
