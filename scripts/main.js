import { PATHS, ASSETS } from './ENV.js';
import { LoadingScene } from './scenes/LoadingScene.js';

import { DevScene } from './scenes/DevScene.js';

import { LoginScene as Auth_LoginScene } from './scenes/M_Auth/LoginScene.js';
import { RegisterScene as Auth_RegisterScene } from './scenes/M_Auth/RegisterScene.js';
import { ResetScene as Auth_ResetScene } from './scenes/M_Auth/ResetScene.js';
import { InterfaceScene as GM_InterfaceScene } from './scenes/GM/InterfaceScene.js';

import { InterfaceScene as Intro_InterfaceScene } from './scenes/M_Intro/InterfaceScene.js';

import { Exercise1Scene as GM1_E1Scene } from './scenes/GM1/Exercise1Scene.js';
import { Exercise2Scene as GM1_E2Scene } from './scenes/GM1/Exercise2Scene.js';
import { Exercise3Scene as GM1_E3Scene } from './scenes/GM1/Exercise3Scene.js';
import { Exercise4Scene as GM1_E4Scene } from './scenes/GM1/Exercise4Scene.js';
import { Exercise5Scene as GM1_E5Scene } from './scenes/GM1/Exercise5Scene.js';
import { Exercise6Scene as GM1_E6Scene } from './scenes/GM1/Exercise6Scene.js';

import { Exercise1Scene as GM2_E1Scene } from './scenes/GM2/Exercise1Scene.js';
import { Exercise2Scene as GM2_E2Scene } from './scenes/GM2/Exercise2Scene.js';
import { Exercise3Scene as GM2_E3Scene } from './scenes/GM2/Exercise3Scene.js';
import { Exercise4Scene as GM2_E4Scene } from './scenes/GM2/Exercise4Scene.js';
import { Exercise5Scene as GM2_E5Scene } from './scenes/GM2/Exercise5Scene.js';

import { Exercise1Scene as GM3_E1Scene } from './scenes/GM3/Exercise1Scene.js';
import { Exercise2Scene as GM3_E2Scene } from './scenes/GM3/Exercise2Scene.js';
import { Exercise3Scene as GM3_E3Scene } from './scenes/GM3/Exercise3Scene.js';
import { Exercise4Scene as GM3_E4Scene } from './scenes/GM3/Exercise4Scene.js';



var configuration = {
    type: Phaser.AUTO,
    backgroundColor: '#FFFFFF', // '#308880'
    scale: {
        mode: Phaser.Scale.FIT,
        parent: document.querySelector('.phaser-game'),
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {width:1920, height: 1080},
        width: 1920,
        height: 1080
    },
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    plugins: {
        scene: [],
        global: [],
    },
    input: {
        activePointers: 4
    },
    scene: [
        LoadingScene, DevScene,
        Auth_LoginScene, Auth_RegisterScene, Auth_ResetScene, GM_InterfaceScene,
        Intro_InterfaceScene,

        GM1_E1Scene, GM1_E2Scene, GM1_E3Scene, GM1_E4Scene, GM1_E5Scene, GM1_E6Scene,
        GM2_E1Scene, GM2_E2Scene, GM2_E3Scene, GM2_E4Scene, GM2_E5Scene,
        GM3_E1Scene, GM3_E2Scene, GM3_E3Scene, GM3_E4Scene,
    ]
}

var game = new Phaser.Game(configuration);
