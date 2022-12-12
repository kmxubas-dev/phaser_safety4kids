import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Video } from "../../classes/Video.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { GM1_E5 as QuizData } from "../../data/QUIZ.js";

export class Exercise5Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e5'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.narrator = new Narrator(this);
        this.popup = new Popup(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        let narrator_step = 1;
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 50, 'Managing Your Anger')
            .addText2(0, 130, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 200, `We all feel angry sometimes, like when things don’t go ${
                '\n'}the way we want them to, or when we feel embarrassed ${
                '\n'}by something we said or did, or when someone hurts our ${
                '\n'}feelings or scares us. Lots of kids tell us that they get ${
                '\n'}angry because of an adult hurting them or someone they ${
                '\n'}love. It is normal to feel angry when this happens. ${
                '\n'}Anger can make us feel uncomfortable, hot, sweaty, ${
                '\n'}and like we might explode.`);
        this.narrator.btn.on('pointerdown', () => {
            if (narrator_step === 1) {
                this.narrator.clearText().addText1(0, 50, 'Managing Your Anger')
                    .addText2(0, 130, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 200, `When angry energy builds up in our bodies, we want to ${
                    '\n'}release it. Often our angry energy gets released in ways ${
                    '\n'}that might hurt ourselves or others, which leaves us ${
                    '\n'}feeling bad or upset. ${
                    '\n\n'}People around us like our teacher at school may not ${
                    '\n'}understand why you get so angry or upset. You then ${
                    '\n'}might get into trouble.`);
            } else if (narrator_step === 2) {
                this.narrator.clearText().addText1(0, 50, 'Managing Your Anger')
                    .addText2(0, 130, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 210, `It’s important when we start to feel the angry energy ${
                    '\n'}building up inside that we find SAFE ways to release it ${
                    '\n'}where we are not hurting ourselves, hurting others, ${
                    '\n'}or damaging property. Do the balloon breathing activity. ${
                    '\n\n'}Some other ideas you might like to try: ${
                    '\n'}- Yelling into your pillow ${
                    '\n'}- Draw a picture of your anger ${
                    '\n'}- Listen to calming music ${
                    '\n'}- Stomp your feet on the grass outside`);
            } else {
                this.narrator.clearText().addText1(0, 50, 'Managing Your Anger')
                    .addText2(0, 130, 'Instructions', '#3AA69D')
                    .addText3(0, 210, `One of the best ways to control your anger is to focus ${
                        '\n'}on your [color=#275eb7]breathing[/color].`)
                    .addText3(0, 340, `Try and [color=#275eb7]time your breathing[/color] ${
                        ''}in time with Dawn blowing \nbubbles, your counsellor can help ${
                        ''}you with this.`)
                    .addText3(0, 480, `When you have finished, click the [color=#275eb7]${
                        ''}Continue[/color] button \nto go to the quiz.`);
    
                this.narrator.btn.removeListener('pointerdown', 
                    this.narrator.btn.listeners('pointerdown')[1]);
                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            }
            narrator_step++;
        });
        // this.animation_video = new Video(this, {title:'Managing Your Anger'}).setAlpha(0);
        // this.animation_video.exit.once('active', () => {
            this.narrator.exit.once('complete', () => { 
                    this.narrator.setShow(false);
                    this.gameplay.start();
                });
        // }).once('complete', () => bg_temporary.destroy());

        this.api.progress_byModule('gm1').then(res => { 
            this.loader.show(false);
            // this.animation_video.setDepth(1).show().play();
            if (res.progress < 4) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm1_e5');
        let character = this.add.sprite(450, scale.height/2, 'gm1_e5_assets', 'character0');
        let instruction = new Instruction(this, {x:scale.width/2+300, y:scale.height/2+80});
        let bubble = this.add.image(0, 0, 'gm1_e5_assets', 'bubble').setVisible(false);
        let btn_next = new Button(this, scale.width-200, scale.height-100, {txt:'Continue >'})
            .setButton('main_blue').setVisible(false);
        // let bg_temporary = this.add.image(scale.width/2, scale.height/2, 'bg');

        this.gameplay = new Gameplay(this, {
            frame:frame, bg:bg, character:character, instruction:instruction,
            bubble:bubble, btn_next:btn_next
        });

        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = () => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'gm1', submodule_key:'gm1_e5', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                this.popup.finish(`Congratulations!`, `You have completed this exercise.\n${
                '\n'}You got [color=#275eb7]${this.quiz.score} out of ${
                this.quiz.data.get('items').length} answers correct[/color] ${
                '\n'}and have earned [color=#275eb7]${this.quiz.score*100} ${
                ''}points[/color] for completing this exercise`);
            });
        }
        // CREATE - End
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
        this.score = 0;
        this.bubble_count = 0;
        let scale = scene.scale;

        // COMPONENTS
        this.frame = components.frame;
        this.bg = components.bg;
        this.character = components.character;
        this.instruction = components.instruction;
        this.bubble = components.bubble;
        this.btn_next = components.btn_next;

        // BUBBLE
        this.bubble_tween = scene.tweens.add({
            targets:this.bubble, scale:0, duration:2000
        }).on('complete', () => {
            this.character.setFrame('character0');
            this.instruction.exhale();
            setTimeout(() => {
                this.scene.tweens.add({
                    targets:this.bubble, x:800, scale:1.25, duration:500
                }).on('complete', () => {
                    let x = this.scene.tweens.add({
                        targets:this.bubble, x:this.scene.scale.width/1.5*2, duration:2000
                    }).on('complete', () => {
                        y.remove();
                        this.bubble_count++;
                        setTimeout(() => { this.bubble_start(); }, 500);
                    });
                    let y = this.scene.tweens.add({
                        targets:this.bubble, y:this.bubble.y-150, duration:1000,
                        loop:-1, yoyo:true, ease:'Sine.easeInOut'
                    });
                });
            }, 500);
        }).pause();

        // BUTTON NEXT
        this.btn_next.on('pointerdown', () => {
            this.btn_next.setVisible(false);
            this.bubble_start();
        });
    }

    start () 
    {
        this.btn_next.setVisible(true);
    }

    bubble_start () 
    {
        if (this.bubble_count < 5) {
            this.bubble.setPosition(690, 575).setScale(0).setVisible(true);
            this.character.setFrame('character1');
            this.instruction.inhale();
            this.bubble_tween.restart();
        } 
        else  {
            this.scene.narrator.setText(`Congratulations!`, 
                `Click on the Continue button to proceed to the quiz`).show();
            this.scene.narrator.exit.once('complete', () => {
                this.scene.quiz.start();
                this.scene.children.bringToTop(this.scene.menu.btn);
            });
            this.scene.narrator.intro.restart();
        }
    }
}

class Instruction extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);
        let tw = scene.tweens;

        this.base_ex = scene.add.image(0, 0, 'gm1_e5_assets', 'exhale').setAlpha(0);
        this.base_in = scene.add.image(0, 0, 'gm1_e5_assets', 'inhale').setAlpha(0);
        this.add([this.base_ex, this.base_in]);

        this.exhale_intro = tw.add({targets:this.base_ex, alpha:1, duration:300}).pause();
        this.exhale_exit = tw.add({targets:this.base_ex, alpha:0, duration:300}).pause();
        this.inhale_intro = tw.add({targets:this.base_in, alpha:1, duration:300}).pause();
        this.inhale_exit = tw.add({targets:this.base_in, alpha:0, duration:300}).pause();
    }

    exhale () 
    {
        this.inhale_exit.restart().once('complete', () => {
            this.exhale_intro.restart();
        });
    }

    inhale () 
    {
        this.exhale_exit.data[0].start = this.base_ex.alpha;
        this.exhale_exit.restart().once('complete', () => {
            this.inhale_intro.restart();
        });
    }
}
