import { PATHS, ASSETS } from './ENV.js';
import { LoadingScene } from './scenes/LoadingScene.js';

import { DevScene } from './scenes/DevScene.js';

import { LoginScene as Auth_LoginScene } from './scenes/M_Auth/LoginScene.js';
import { RegisterScene as Auth_RegisterScene } from './scenes/M_Auth/RegisterScene.js';
import { ResetScene as Auth_ResetScene } from './scenes/M_Auth/ResetScene.js';
import { InterfaceScene as GM_InterfaceScene } from './scenes/GM/InterfaceScene.js';

import { InterfaceScene as Intro_InterfaceScene } from './scenes/M_Intro/InterfaceScene.js';
import { Exercise1Scene as Intro_E1Scene } from './scenes/M_Intro/Exercise1Scene.js';
import { Exercise2Scene as Intro_E2Scene } from './scenes/M_Intro/Exercise2Scene.js';
import { Exercise3Scene as Intro_E3Scene } from './scenes/M_Intro/Exercise3Scene.js';
import { CompletionScene as Intro_CompletionScene } from './scenes/M_Intro/CompletionScene.js';

import { IntroScene as GM1_IntroScene } from './scenes/GM1/IntroScene.js';
import { Exercise1Scene as GM1_E1Scene } from './scenes/GM1/Exercise1Scene.js';
import { Exercise2Scene as GM1_E2Scene } from './scenes/GM1/Exercise2Scene.js';
import { Exercise3Scene as GM1_E3Scene } from './scenes/GM1/Exercise3Scene.js';
import { Exercise4Scene as GM1_E4Scene } from './scenes/GM1/Exercise4Scene.js';
import { Exercise5Scene as GM1_E5Scene } from './scenes/GM1/Exercise5Scene.js';
import { Exercise6Scene as GM1_E6Scene } from './scenes/GM1/Exercise6Scene.js';
import { CompletionScene as GM1_CompletionScene } from './scenes/GM1/CompletionScene.js';

import { IntroScene as GM2_IntroScene } from './scenes/GM2/IntroScene.js';
import { Exercise1Scene as GM2_E1Scene } from './scenes/GM2/Exercise1Scene.js';
import { Exercise2Scene as GM2_E2Scene } from './scenes/GM2/Exercise2Scene.js';
import { Exercise3Scene as GM2_E3Scene } from './scenes/GM2/Exercise3Scene.js';
import { Exercise4Scene as GM2_E4Scene } from './scenes/GM2/Exercise4Scene.js';
import { Exercise5Scene as GM2_E5Scene } from './scenes/GM2/Exercise5Scene.js';
import { CompletionScene as GM2_CompletionScene } from './scenes/GM2/CompletionScene.js';

import { IntroScene as GM3_IntroScene } from './scenes/GM3/IntroScene.js';
import { Exercise1Scene as GM3_E1Scene } from './scenes/GM3/Exercise1Scene.js';
import { Exercise2Scene as GM3_E2Scene } from './scenes/GM3/Exercise2Scene.js';
import { Exercise3Scene as GM3_E3Scene } from './scenes/GM3/Exercise3Scene.js';
import { Exercise4Scene as GM3_E4Scene } from './scenes/GM3/Exercise4Scene.js';
import { CompletionScene as GM3_CompletionScene } from './scenes/GM3/CompletionScene.js';

import { CompletionScene as M_CompletionScene } from './scenes/M_Completion/CompletionScene.js';



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
        Intro_InterfaceScene, Intro_E1Scene, Intro_E2Scene, Intro_E3Scene, Intro_CompletionScene,

        GM1_IntroScene, GM1_E1Scene, GM1_E2Scene, GM1_E3Scene, GM1_E4Scene, GM1_E5Scene,
        GM1_E6Scene, GM1_CompletionScene,
        GM2_IntroScene, GM2_E1Scene, GM2_E2Scene, GM2_E3Scene, GM2_E4Scene, GM2_E5Scene,
        GM2_CompletionScene,
        GM3_IntroScene, GM3_E1Scene, GM3_E2Scene, GM3_E3Scene, GM3_E4Scene,
        GM3_CompletionScene,
        
        M_CompletionScene,
    ]
}

var game = new Phaser.Game(configuration);
