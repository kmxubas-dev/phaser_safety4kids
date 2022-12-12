import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { INTRO_E3 as QuizData } from "../../data/QUIZ.js";

export class Exercise3Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'intro_e3'
        });
    }



    init () 
    {
        this.gameplay = {
            affirmation_count: 0,
            affirmation_text_count: 0,

            text_affirmations_step: 0,
            text_affirmations: [
                'Affirmation 1',
                'Affirmation 2',
                'Affirmation 3'
            ]
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.popup = new Popup(this).window_setSize(800, 600);
        this.menu = new Menu(this, {}).setLayout('dev').show();

        this.affirmation1 = this.sound.add('sfx_intro_e3_1');
        this.affirmation2 = this.sound.add('sfx_intro_e3_2');
        this.affirmation3 = this.sound.add('sfx_intro_e3_3');
    }

    create () 
    {
        // INTRO - Start
        this.add.image(this.scale.width/2, this.scale.height/2, 'bg_intro_e3');
        this.add.image(this.scale.width/2, this.scale.height/2, 'frame').setDepth(1000);
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.board.setTexture('intro_e3_assets').setFrame('board').setX(100);
        this.narrator.show(true).addText1(110, 25, 'Good Things About Me')
            .addText2(50, 110, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(25, 220, `When we go through a tough time, we might forget the ${
                '\n'}good things about ourselves or our brain can get stuck ${
                '\n'}on thinking that we are not good-enough. We can use ${
                '\n'}affirmations to remind us of, and help our brain to ${
                '\n'}remember, the good things about us and that we can ${
                '\n'}feel good about the efforts we make every day.`);
        this.narrator.btn.on('pointerdown', () => {
            this.narrator.narrator.setFrame('default');
            this.narrator.clearText().addText1(110, 25, 'Good Things About Me')
                .addText2(275, 110, 'Instructions', '#3AA69D')
                .addText3(-25, 160, `Listen to these sound clips by clicking on the ${
                    ''}[color=#275eb7]3 buttons[/color] below.`)
                .addText3(25, 220, `Say what you hear\n1st time, [color=#275eb7]whisper it[/color] ${
                    '\n'}2nd time, [color=#275eb7]say it in a normal voice[/color] ${
                    '\n'}3rd time, [color=#275eb7]shout it nice and loudly![/color]`)
                .addText3(-25, 420, `You can practice these as many times as you like, the more you ${
                    '\n'}say your affirmations the more [color=#275eb7]powerful[/color] they become.`)
                .addText3(-25, 530, `Click the [color=#275eb7]Continue[/color] ${
                    ''}button when you have finished.`);
            this.narrator.btn.setScale(0).setPosition(600, 350);
            this.item1 = new Item(this, {scene:'intro_e1', x:-300, y:275, item:'item1'})
                .on('pointerdown', () => {
                    if (!this.item1.played) {
                        this.item1.played = true;
                        this.gameplay.affirmation_count++;
                    }
                    this.affirmation1.stop();
                    this.affirmation2.stop();
                    this.affirmation3.stop();
                    this.affirmation1.play();
                    this.narrator.btn.setScale((this.gameplay.affirmation_count >= 3));
                });
            this.item2 = new Item(this, {scene:'intro_e1', x:0, y:275, item:'item2'})
                .on('pointerdown', () => {
                    if (!this.item2.played) {
                        this.item2.played = true;
                        this.gameplay.affirmation_count++;
                    }
                    this.affirmation1.stop();
                    this.affirmation2.stop();
                    this.affirmation3.stop();
                    this.affirmation2.play();
                    this.narrator.btn.setScale((this.gameplay.affirmation_count >= 3));
                });
            this.item3 = new Item(this, {scene:'intro_e1', x:300, y:275, item:'item3'})
                .on('pointerdown', () => {
                    if (!this.item3.played) {
                        this.item3.played = true;
                        this.gameplay.affirmation_count++;
                    }
                    this.affirmation1.stop();
                    this.affirmation2.stop();
                    this.affirmation3.stop();
                    this.affirmation3.play();
                    this.narrator.btn.setScale((this.gameplay.affirmation_count >= 3));
                });
            this.buttons = this.add.container(0, 0).add([this.item1, this.item2, this.item3]);
            this.narrator.add([this.buttons]);
            this.narrator.btn.removeListener('pointerdown', 
                this.narrator.btn.listeners('pointerdown')[1]);
            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        this.narrator.intro.once('complete', () => {
        });
        this.narrator.exit.once('complete', () => {
            this.quiz.start();
        });
        this.narrator.hide_start.once('active', () => {
            this.buttons.setVisible(false);
        })
        // INTRO - End
        
        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = (popup=this.finish) => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'intro', submodule_key:'intro_e3', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                this.popup.finish(`Congratulations!`, `You have completed this exercise.${
                    '\n'}You have earned [color=#275eb7]${this.quiz.score*100} points[/color] ${
                    ''}for completing this exercise.`);
                this.popup.continue_txt.setText(`Click the [color=#275eb7]Continue[/color] ${
                    ''}button to finish the module.`);
            });
        }
    }

    update () 
    {

    }
}



class Item extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);
        let sprite = 'intro_e3_assets';
        this.status = false;
        this.item = scene.add.sprite(0, 0, sprite, data.item).setScale(0.9);

        this.pointerover = scene.add.container(0, 0).setVisible(false).add([]);
        this.add([this.item, this.pointerover]);
        this.setSize(this.item.width, this.item.height).setInteractive({useHandCursor:true})
            .on('pointerover', () => {
                // this.pointerover.setVisible(true);
                this.grow.restart();
            }).on('pointerout', () => {
                // this.pointerover.setVisible(false);
                this.shrink.restart();
            });

        // TWEENS - Start
        this.grow = scene.tweens.add({ targets:[this], scale:1.1, duration:111 }).pause();
        this.shrink = scene.tweens.add({ targets:[this], scale:1, duration:111 }).pause();
        // TWEENS - End
    }
}
