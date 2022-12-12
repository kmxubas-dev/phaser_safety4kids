import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { GM2_E5 as QuizData } from "../../data/QUIZ.js";

export class Exercise5Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm2_e5'
        });
    }



    init () 
    {
        this.GM2_E6 = {
            STEPS: [
                {x2:466, y2:240,  name:'popup1'},
                {x2:455, y2:600,  name:'popup2'},
                {x2:475, y2:848,  name:'popup3'},
                {x2:1225, y2:320, name:'popup4'},
                {x2:1225, y2:720, name:'popup5'},
            ],
            COMIC: [
                {x:466, y:240,  frame:'comic1'},
                {x:455, y:600,  frame:'comic2'},
                {x:475, y:848,  frame:'comic3'},
                {x:1225, y:320, frame:'comic4'},
                {x:1222, y:720, frame:'comic5'},
            ],
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.gameplay = new Gameplay(this);
        this.popup = new Popup(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this).setDepth(1);
        this.narrator.show(true).addText1(50, 50, 'Online Safety')
            .addText2(50, 140, 'Instructions', '#3AA69D')
            .addText3(50, 220, `Build the comic book and read each part of the ${
                '\n'}story as it appears.`)
            .addText3(50, 345, `Click the [color=#275eb7]Next[/color] button to ${
                ''}build the comic book.`)
            .addText3(50, 420, `When you have finished building the comic book \nyou can save ${
                ''}the image by clicking [color=#275eb7]Save[/color].`)
            .addText3(50, 550, `Click the [color=#275eb7]Continue[/color] button to get started.`);
        this.narrator.exit.once('complete', () => this.gameplay.start());
        this.api.progress_byModule('gm2').then(res => {
            this.loader.show(false);
            if (res.progress < 4) this.scene.start('gm_interface');
        });
        // INTRO - End

        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);

        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = (popup=this.popup) => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'gm2', submodule_key:'gm2_e5', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                this.popup.finish(`Congratulations!`, `You have completed this exercise. ${
                    '\n\n'}You got [color=#275eb7]${this.quiz.score} out of ${
                    this.quiz.data.get('items').length} answers correct[/color] ${
                    '\n'}and have earned [color=#275eb7]${this.quiz.score*100} ${
                    ''}points[/color] for completing this exercise.`);
            });
        }
    }

    update () 
    {

    }
}

class Gameplay 
{
    constructor (scene) 
    {
        this.scene = scene;
        this.step = 0;
        this.step_state = false;
        this.steps = [];
        this.panels_comic = [];

        let scale = this.scene.scale;
        scene.add.image(scene.scale.width/2, scene.scale.height/2-0.5, 'bg_gm2_e5');

        this.btn_back = new Button(this.scene, scale.width/2-797, scale.height-100,
            {w:180, h:80, txt:'Back'}).setButton().setVisible(false)
            .on('pointerdown', () => { this.updateSMART(-1); });
        this.btn_next = new Button(this.scene, scale.width/2+797, scale.height-200,
            {w:180, h:80, txt:'Next'}).setButton().setVisible(false)
            .on('pointerdown', () => { this.updateSMART(); });
        this.btn_save = new Button(this.scene, scale.width/2+797, scale.height-155,
            {w:166, h:80, txt:'Save'}).setButton('green').setVisible(false)
            .on('pointerdown', () => { this.snapshot() });
        this.btn_continue = new Button(this.scene, scale.width/2+797, scale.height-255,
            {w:180, h:80, txt:'Continue >', txtsize:'4.2em'}).setVisible(false)
            .on('pointerdown', () => { setTimeout(() => {this.scene.quiz.start();}, 500); });
        this.scene.GM2_E6.COMIC.forEach((data, i) => {
            let panel = this.scene.add.image(data.x, data.y, 'gm2_e5_panels',
                data.frame).setAlpha(0);
            panel.intro = this.scene.tweens.add({targets:panel, alpha:1, duration:800}).pause();
            // if (i === 2) this.scene.children.moveDown(panel);
            this.panels_comic.push(panel);
        });
        this.scene.GM2_E6.STEPS.forEach((step, i) => {
            let data = JSON.parse(JSON.stringify(step));
            data.x = scale.width/2; data.y = scale.height/2;
            let panel = new Panel(this.scene, data);
            panel.intro.on('active', () => {
                this.btn_back.setVisible(false);
                this.btn_next.setVisible(false);
            }).on('complete', () => {
                // this.btn_back.setVisible((this.step > 1));
                this.btn_next.setVisible((this.step <= this.steps.length));
            });
            panel.exit.on('active', () => {
                this.btn_back.setVisible(false);
                this.btn_next.setVisible(false);
            }).on('complete', () => {
                this.panels_comic[i].intro.restart();
                // this.btn_back.setVisible((this.step > 1));
                this.btn_next.setVisible((this.step < this.steps.length));
                this.btn_continue.setVisible((this.step === this.steps.length));
                this.btn_save.setVisible((this.step === this.steps.length));
            });
            this.steps.push(panel);
        });
    }

    start () 
    {
        this.btn_next.setVisible(true);
    }

    updateSMART (direction=1, step=this.step) 
    {
        if (!this.step_state) {
            if (direction === 1 && step <= this.steps.length) {
                this.step++;
                this.steps[step].intro.restart();
            } else if (direction === -1 && step > 1) {
                step = --this.step;
                this.steps[step].exit_left.restart();
                this.steps[step-1].intro_left.restart();
            }
        } else {
            if (step !== 0) {
                this.steps[step-1].exit.restart();
            }
        }
        this.step_state = !this.step_state;
    }

    snapshot () 
    {
        let canvas;
        let exportCanvasAsPNG = (id, fileName, dataUrl) => {
            var canvasElement = document.getElementById(id);
            var MIME_TYPE = "image/png";
            var imgURL = dataUrl;
            var dlLink = document.createElement('a');
            dlLink.download = fileName;
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        }

        this.scene.game.renderer.snapshotArea(90, 30, 1525, 1000, (image) => {                
            exportCanvasAsPNG(canvas, 'Online Safety', image.src);
        });
    }
}

class Panel extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setAlpha(0);
        scene.add.existing(this);

        // CREATE - Start
        let scale = scene.scale;
        this.base = scene.add.image(0, 0, 'gm2_e5_panels', data.name);
        this.add([this.base]).setSize(this.base.displayWidth, this.base.displayHeight);
        // CREATE - End

        // TWEENS - Start
        let tw = scene.tweens;
        this.intro = tw.add({targets:this, duration:1000, alpha:{from:0, to:1}}).pause();
        this.exit = tw.add({targets:this, duration:1000, x:data.x2, y:data.y2, scale:0}).pause();
        this.intro_left = scene.tweens.add({ targets:this, duration:1000,
            x:{from:scale.width*2, to:scale.width/2} }).pause();
        this.exit_left = scene.tweens.add({ targets:this,
            x:scale.width*-1, duration:1000 }).pause();
        // TWEENS - End
    }
}
