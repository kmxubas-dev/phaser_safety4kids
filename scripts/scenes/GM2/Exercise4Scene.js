import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js"
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Video } from "../../classes/Video.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";

export class Exercise4Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm2_e4'
        });
    }



    init () 
    {
        this.GM2_E5 = {
            QUESTIONS: [
                'What is step 1 of your\nSafety Plan?',
                'What is step 2 of your\nSafety Plan?',
                'What is step 3 of your\nSafety Plan?',
                'What is step 4 of your\nSafety Plan?',
                'What is step 5 of your\nSafety Plan?',
            ],
            DOM_TEXTAREA: `
                <input type="text" id="textarea" maxlength="69" class="text-4xl rounded-lg border-gray-300
                border-0 border-b-8" style="width:660px; font-family:Font_Main; resize:none;">
            `
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.menu = new Menu(this, {}).setLayout('dev').show();
        this.popup = new Popup(this);
    }

    create () 
    {
        // INTRO - Start
        let narrator_step = 1;
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(-50, 25, 'Safety Planning')
            .addText2(-50, 110, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(-50, 220, `When we are living with someone who can be violent, ${
                '\n'}hurt us or makes us feel unsafe, is it good to talk ${
                '\n'}to someone about our worries. It can also help to make ${
                '\n'}a Safety Plan. A safety plan has ideas and steps ${
                '\n'}to keep us safe if things at home get scary ${
                '\n'}and we need help.`);
        this.narrator.btn.on('pointerdown', () => {
            if (narrator_step === 1) {
                this.narrator.clearText().addText1(-50, 25, 'Safety Planning')
                    .addText2(-50, 110, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(-50, 220, `Some safety steps in your plan might be - ${
                        '\n\n'}•	Go to a safe place ${
                        '\n'}•	Don’t get in the middle of the fighting adults ${
                        '\n'}•	Phone numbers of people you can call in an emergency ${
                        '\n'}       such as a relative or the police ${
                        '\n'}•	Call for help (if it is safe) ${
                        '\n'}•	Do activities to help calm your worries, like colouring in`);
            } else {
                this.narrator.clearText().addText1(-50, 25, 'Safety Planning')
                    .addText2(-50, 110, 'Instructions', '#3AA69D')
                    .addText3(-50, 190, `Work with your counsellor to come up with 5 steps ${
                        '\n'}for your safety plan.`)
                    .addText3(-50, 305, `Type in the first step of you safety plan, then click the ${
                        '\n'}[color=#275eb7]Next[/color] button.`)
                    .addText3(-50, 425, `Repeat this for [color=#275eb7]all 5 steps[/color], ${
                        ''}then click the [color=#275eb7]Build Plan[/color] button`)
                    .addText3(-50, 500, `If you want to save your plan, click the ${
                        ''}[color=#275eb7]Save[/color] button.`)
                    .addText3(-50, 575, `If you want to do another plan, click ${
                        ''}[color=#275eb7]Do it again[/color].`)
                    .addText3(-50, 650, `Otherwise to finish, click the ${
                        ''}[color=#275eb7]Continue[/color] button.`);
    
                this.narrator.btn.removeListener('pointerdown', 
                    this.narrator.btn.listeners('pointerdown')[1]);
                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            }
            narrator_step++;
        });
        // this.animation_video = new Video(this, {title:'Safety Planning'}).setAlpha(0);
        // this.animation_video.exit.on('active', () => {
            this.narrator.exit.once('complete', () => {
                this.narrator.setShow(false);
                this.menu.show();
                this.gameplay.start();
            });
        // }).once('complete', () => bg_temporary.destroy());

        this.api.progress_byModule('gm2').then(res => { 
            this.loader.show(false);
            if (res.progress < 3) this.scene.start('gm_interface');
            // this.animation_video.setDepth(1).show().play();
        });
        // INTRO - End

        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm2_e4');
        let interface1 = this.add.image(scale.width/2, scale.height/2,
            'gm2_e4_assets', 'interface1').setVisible(true);
        let question = new Question(this, {x:scale.width/2, y:scale.height/2});
        let plan = new Plan(this, {x:scale.width/2, y:scale.height/2}).setVisible(false);
        let btn_build = new Button(this, scale.width/2, scale.height/2, { w:750, h:190, txt:' ',
            txtsize:'11em', texture:'gm2_e4_buttons'}).setButton('build').setVisible(false);
        let btn_previous = new Button(this, scale.width/2-490, scale.height-200, 
            {txt:'< Previous'}).setButton().setVisible(false);
        let btn_next = new Button(this, scale.width/2+450, scale.height-200, 
            {txt:'Next >'}).setButton().setVisible(false);
        // let bg_temporary = this.add.image(scale.width/2, scale.height/2, 'bg');

        this.gameplay = new Gameplay(this, {
            interface1:interface1, question:question, plan:plan,
            btn_build:btn_build, btn_previous:btn_previous, btn_next:btn_next,
        });
    }

    update () 
    {

    }
}



class Gameplay 
{
    constructor (scene, components={}) 
    {
        this.scene = scene;

        // COMPONENTS
        this.interface1 = components.interface1;
        this.question = components.question;
        this.plan = components.plan;
        this.btn_build = components.btn_build;
        this.btn_previous = components.btn_previous;
        this.btn_next = components.btn_next;

        this.btn_build.txt.setPadding(0, 40, 0, 0).setFixedSize(600, 150);
        this.btn_build.on('pointerdown', () => {
            let flag = this.question.answers.findIndex((answer) => answer === '');
            if (this.question.answers.length === 5 && flag === -1) this.initialize_plan();
            this.btn_previous.setVisible(false);
            this.btn_next.setVisible(false);
            this.btn_build.setVisible(false);
        });

        this.btn_next.on('pointerdown', () => this.loadQuestion_pointerdown(1) );
        this.btn_previous.on('pointerdown', () => this.loadQuestion_pointerdown(-1) );

        this.initialize();
    }

    start () 
    {
        this.question.intro.restart();
        this.btn_next.setVisible(true);
    }

    initialize () 
    {
        let scale = this.scene.scale;

        this.btn_finish = new Button(this.scene, scale.width-200, scale.height-275, 
            {w:200, h:69, txt:'Continue >', txtsize:'4.75em'}).setButton().setVisible(false)
            .on('pointerdown', () => {
                this.scene.loader.show();
                this.scene.api.usersubmodule_create({
                    module_key:'gm2', submodule_key:'gm2_e4', score:500, data:{data:null}
                }).then(res => {
                    this.scene.loader.show(false);
                    this.scene.popup.finish(`Congratulations!`, 
                        `You have completed this exercise. ${'\n\n'}You have earned ${
                        ''}[color=#275eb7]500 points[/color] for completing this exercise.`);
                });
            });
        this.btn_save = new Button(this.scene, scale.width-200, scale.height-375,
            {w:200, h:69, txt:'Save'}).setButton('green').setVisible(false)
            .on('pointerdown', () => {
                this.scene.menu.show(false);
                this.snapshot();
                this.scene.menu.show();
            });
        this.btn_retry = new Button(this.scene, scale.width-200, scale.height-175,
            {w:200, h:69, txt:'Do it again'}).setButton('purple').setVisible(false)
            .on('pointerdown', () => {
                this.plan.reset();
                this.question.reset();
                this.btn_next.setVisible(true);

                this.btn_save.setVisible(false);
                this.btn_finish.setVisible(false);
                this.btn_retry.setVisible(false);
            });
    }

    initialize_plan () 
    {
        this.question.setVisible(false);
        this.plan.build(this.question.answers).setVisible(true);
        setTimeout(() => {
            this.btn_save.setVisible(true);
            this.btn_finish.setVisible(true);
            this.btn_retry.setVisible(true);
        }, 300);
    }

    loadQuestion_pointerdown (step)
    {
        let questions = this.scene.GM2_E5.QUESTIONS;
        if (this.question.answer.value !== '' || step < 0) {
            if (this.question.step <= 4)
                this.question.answers[this.question.step] = this.question.answer.value;
            this.question.answer.value = '';
            this.question.step += step;
            this.question.loadQuestion();
            this.btn_previous.setVisible((this.question.step !== 0));
            this.btn_next.setVisible((this.question.step !== questions.length));
            this.btn_build.setVisible((this.question.step === questions.length));
        }
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

        this.scene.game.renderer.snapshotArea(50, 80, this.scene.scale.width-390, 
            this.scene.scale.height-155, (image) => { 
                exportCanvasAsPNG(canvas, 'My Plan', image.src);
        });
    }
}

class Plan extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        this.base = scene.add.image(0, 0, 'gm2_e4_assets', 'interface2');
        this.txt = scene.add.text(-400, -110, '', { align:'left', color:'#000000',
            fontSize:'6em', fontFamily:'Font_Main', wordWrap:{width:this.base.displayWidth}})
            .setOrigin(0, 0);
        this.add([this.base, this.txt])
            .setSize(this.base.displayWidth, this.base.displayHeight);
    }

    build (answers) 
    {
        answers.forEach((answer, i) => { this.txt.text += (i+1)+'. '+answer+'\n'; });
        return this;
    }

    reset () 
    {
        this.setVisible(false);
        this.txt.setText('');
    }
}

class Question extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        this.step = 0;
        this.answers = [];
        this.base = scene.add.image(0, 0, 'gm2_e4_assets', 'paperpad');
        this.arrow = scene.add.image(-633, 50, 'gm2_e4_assets', 'arrow').setVisible(false);
        this.txt = scene.add.text(0, -310, '', { align:'center', color:'#000000',
            fontSize:'10em', fontFamily:'Font_Header', lineSpacing:30,
            wordWrap:{width:this.base.displayWidth} }).setOrigin(0.5, 0);
        this.dom_textarea = scene.add.dom(0, 50).createFromHTML(scene.GM2_E5.DOM_TEXTAREA)
            .setScale(1.55).setVisible(false);
        this.add([this.base, this.dom_textarea, this.txt, this.arrow]);
        this.intro = this.scene.tweens.add({targets:this, scale:1, duration:500})
            .on('complete', () => { this.loadQuestion(); }).pause();
    }

    loadQuestion (i=this.step) 
    {
        this.answer = this.dom_textarea.getChildByID('textarea');
        this.txt.text = (i !== this.scene.GM2_E5.QUESTIONS.length) ? 
            this.scene.GM2_E5.QUESTIONS[i]:'Click build button to proceed';
        this.answer.value = this.answers[i] || '';
        this.txt.setVisible((i !== this.scene.GM2_E5.QUESTIONS.length));
        this.dom_textarea.setVisible((i !== this.scene.GM2_E5.QUESTIONS.length));
        this.arrow.setVisible((i !== this.scene.GM2_E5.QUESTIONS.length));
    }

    reset () 
    {
        this.step = 0;
        this.setVisible(true);
        this.intro.restart();
    }
}
