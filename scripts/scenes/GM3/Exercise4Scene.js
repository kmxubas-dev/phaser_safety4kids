import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { GM3_E4 as QuizData } from "../../data/QUIZ.js";

export class Exercise4Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm3_e4'
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
        this.popup = new Popup(this).window_setSize(880, 660);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this).setInteractive().setDepth(1);
        this.narrator.show(true).addText1(0, 50, 'Respectful Relationships')
            .addText2(0, 140, 'Instructions', '#3AA69D')
            .addText3(0, 250, `Click on each of the [color=#275eb7]photographs[/color] ${
                ''}to find out more.`)
            .addText3(0, 350, `When you have finished, click the ${
                ''}[color=#275eb7]Continue[/color] button \nfor a fun challenge.`);
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            setTimeout(() => {this.gameplay.start();}, 500);
        });
        this.api.progress_byModule('gm3').then(res => { 
            this.loader.show(false);
            if (res.progress < 3) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let bg = this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm3_e4');
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);

        let item1 = new Item(this, { name:'What is respect?',
            x:scale.width/2-500, y:scale.height/2+80, item:'item_fence1',
            bubble:'bubble1', bubbleX:-15, bubbleY:-288, checkX:120, checkY:110,
        });
        let item2 = new Item(this, { name:'What is communication?',
            x:scale.width/2, y:scale.height/2+50, item:'item_fence2',
            bubble:'bubble2', bubbleX:-15, bubbleY:-300, checkX:120, checkY:110,
        });
        let item3 = new Item(this, { name:'What is a respectful relationship?',
            x:scale.width/2+500, y:scale.height/2+80, item:'item_fence3',
            bubble:'bubble3', bubbleX:-15, bubbleY:-275, checkX:120, checkY:90,
        });
        let items = [item1, item2, item3];

        this.gameplay = new Gameplay(this, {bg:bg, items:items});
        this.quiz = new Quiz(this, QuizData.ITEMS);
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
        let scale = scene.scale;

        // COMPONENTS
        this.bg = components.bg;
        this.items = components.items;

        this.items.forEach((item, i) => {
            if (i === 0) {
                item.on('pointerdown', () => this.popup.info(`What is respect?`, 
                    `Respect is acting in a way that shows you care about ${
                    '\n'}someone, their feelings and their wellbeing. Showing ${
                    '\n'}respect is being kind, not calling people mean names,not  ${
                    '\n'}hurting them, being careful, and accepting others for ${
                    '\n'}their different thoughts and beliefs. It’s also about ${
                    '\n'}treating ourselves and others in a kind way. We show ${
                    '\n'}respect by what we do and say, how we behave, our ${
                    '\n'}attitudes and how we treat ourselves ${
                    '\n'}and others.`, 'item_popup1'));
            } else if (i === 1) {
                item.on('pointerdown', () => this.popup.info(`What is communication?`,
                    `Communication is how we share information, messages, ${
                    '\n'}thoughts, or ideas with other people. We can communicate ${
                    '\n'}in different ways like talking, writing, texting, or ${
                    '\n'}without using words like sign language, body language ${
                    '\n'}and listening. Good communication is listening to others ${
                    '\n'}even when you do not agree with them, taking turns to share ${
                    '\n'}thoughts and feelings, and talking calmly with each other.`, 
                    'item_popup2'));
            } else {
                item.on('pointerdown', () => this.popup.info(`What is a respectful relationship?`,
                    `A respectful relationship is where both people are ${
                    '\n'}treated nicely and feel safe and supported. Both people ${
                    '\n'}have the right to feel safe to talk about their thoughts ${
                    '\n'}and feelings, to make their own choices, to feel heard, ${
                    '\n'}and to be treated with kindness and care. In a respectful ${
                    '\n'}relationship, no one gets hurt, is not called names, ${
                    '\n'}and is not controlled or scared of the other person.`, 'item_popup3'));
            }
        });

        let arrow = scene.add.image(scale.width-450, scale.height-150, 
            'gm3_e4_assets', 'arrow').setVisible(false);
        scene.tweens.add({targets:arrow, x:arrow.x-20, duration:500, yoyo:true, loop:-1});
        this.popup = new Popup(this.scene).window_setSize(1300, 550).setInteractive();
        this.popup.btn_ok.btn_setSize(125, 80).setPosition(525, 240);
        this.popup.txt_header.setX(175).setWordWrapWidth(880).y-=60;
        this.popup.txt.setFontSize('5.75em').setWordWrapWidth(880).setPosition(175, -180);
        this.popup.window.destroy();
        this.popup.window = scene.add.image(-10, 10, 'gm3_e4_assets', 'board');
        this.popup.addAt(this.popup.window, 1);
        this.popup.item = scene.add.sprite(-430, -50, 'gm3_e4_assets', 'item_popup1');
        this.popup.add(this.popup.item);
        this.popup.info = (text1, text2, image) => {
            arrow.setVisible(false);
            this.btn_quiz.setVisible(false);
            this.popup.show(text1, text2);
            this.popup.item.setFrame(image);
            if (this.items.findIndex((btn) => btn.clicked !== true) === -1) {
                this.popup.exit.once('complete', () => {
                    arrow.setVisible(true);
                    this.btn_quiz.setVisible(true);
                });
            }
        }

        this.btn_quiz = new Button(scene, scale.width-200, scale.height-150,
            {w:280, txt:'Start quiz >'}).setVisible(false)
            .on('pointerdown', () => {
                this.scene.quiz.txt_header.setText(`Quiz\n${
                    ''}[size=66][color=#275eb7]\nLet’s see what you can remember.[/color][/size]`);
                this.scene.quiz.start();
            });
    }

    start () 
    {
        
    }
}

class Quiz extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2).setAlpha(0)
            .setSize(scene.scale.width, scene.scale.height).setInteractive();
        scene.add.existing(this);
        this.items = data;
        this.choices = [];
        this.answer = [];
        this.score = 0;
        this.step = 0;
        this.instruction = `\n\nSelect the respectful behaviour. To do this,${
            '\n'}[color=#275eb7]click, hold, and drag to draw a circle around it[/color] ${
            '\n'}and then click [color=#275eb7]Continue[/color] to check your answer. ${
            '\n\n'}Click the [color=#275eb7]Start[/color] button to begin the quiz.`;

        this.bg = scene.add.image(0, -0.5, 'bg_quiz');
        this.narrator = scene.add.sprite(scene.scale.width*-1, 250, 'characters_narrator')
            .setScale(0.69);
        this.txt_header = scene.add.rexBBCodeText(-380, -290, 'Quiz', { align:'left',
            color:'#000000', fontSize:'10em', fontFamily:'Font_Header', lineSpacing:-20, 
            wordWrap:{width:950} }).setOrigin(0, 0);
        this.txt = scene.add.rexBBCodeText(-380, -180, this.instruction, { align:'left', 
            color:'#000000', fontSize:'6.9em', fontFamily:'Font_Main', lineSpacing:-20, 
            wordWrap:{width:950} }).setOrigin(0, 0);
        this.btn = new Button(scene, 510, 350, {w:250, txt:'Start'})
            .setVisible(false).once('pointerdown', () => {
                this.btn.setVisible(false);
                this.loadItem();
            });
        this.add([this.bg, this.narrator, this.txt_header, this.txt, this.btn]);

        // TWEENS - Start
        this.intro = scene.tweens.add({targets:this, alpha:1, duration:500}).pause();
        this.exit = scene.tweens.add({targets:this, alpha:0, duration:500}).pause();
        this.narrator_intro = scene.tweens.add({targets:this.narrator, x:-650,
            duration:800}).pause();
        this.narrator_exit = scene.tweens.add({targets:this.narrator, x:scene.scale.width*-1,
            duration:800}).pause();
        // TWEENS - End
    }

    start () 
    {
        // this.scene.children.bringToTop(this);
        this.intro.restart().once('complete', () => {
            this.narrator_intro.once('complete', () => {
                this.btn.setVisible(true).once('pointerdown', () => {
                    this.txt.setVisible(false);
                    this.txt_header.setFontSize('5em').setPosition(0, -330).setOrigin(0.5, 0);
                    this.txt_header.setText('Drag a circle around the respectful relationship...');
                    this.narrator_exit.restart();
                    this.btn.btn_setText('Continue >').on('pointerdown', () => {
                            let item = this.items[this.step-1];
                            if (this.answer.length === 1) {
                                if (item.answer === this.answer[0].choice.value) {
                                    // this.getByName('text').setText(item.feedback_correct)
                                    //     .setPosition(0, -30);
                                    this.score++;
                                } else {
                                    // this.getByName('text').setText(item.feedback_wrong)
                                    //     .setPosition(0, -30);
                                }
                                this.graphics.clear();
                                this.choices.forEach(choice => choice.destroy());
                                this.choices.splice(0, this.choices.length);
                                this.btn.setVisible(false);
                                if (this.step < this.items.length) this.loadItem();
                                else this.finish();
                            }
                            this.answer = [];
                        });
                });
            }).restart();
            this.eventListeners();
        });
    }

    finish () 
    {
        this.scene.loader.show();
        this.scene.api.usersubmodule_create({
            module_key:'gm3', submodule_key:'gm3_e4', score:this.score*100, data:{data:null}
        }).then(res => {
            this.scene.loader.show(false);
            this.scene.popup.finish(`Congratulations!`, `You have completed this exercise.\n\n${
                ''}You got [color=#275eb7]${this.score} out of ${this.items.length} answers ${
                ''}correct[/color] \nand have earned [color=#275eb7]${this.score*100} points${
                ''}[/color] for completing this exercise.`);
        });
    }

    loadItem (step = this.step) 
    {
        let item_data = this.items[step];
        item_data.choices.forEach((choice) => {
            let item = this.scene.add.container(choice.x, choice.y).setDepth(10);
            item.bg = this.scene.add.image(0, 0, 'papernote').setDisplaySize(500, 280);
            item.txt = this.scene.add.text(0, 0, choice.name, { add:true, align:'center',
                fontSize:'5em', fontFamily:'Font_Main', color:'#000000',
                wordWrap:{width:item.bg.displayWidth-50} }).setOrigin(0.5, 0.5);
            item.add([item.bg, item.txt]).setSize(item.bg.displayWidth, item.bg.displayHeight);
            item.choice = {
                value: choice.value,
                feedback_correct: item_data.feedback_correct,
                feedback_wrong: item_data.feedback_wrong
            }
            this.choices.push(item);
        });
        this.btn.setVisible(true);
        this.step++;
    }

    eventListeners () 
    {
        this.graphics = this.scene.add.graphics({ x:0, y:0, add:true,
            lineStyle:{ width:5, color:0x27ae60, alpha:1 },
            fillStyle:{ color:0x27ae60, alpha:1 },
        });

        //  Events
        var sx = 0;
        var sy = 0;
        var draw = false;
        this.ellipse = { x:0, y:0, w:0, h:0 };
    
        //  Stop the right-click from triggering the context menu
        //  You can also set this in the game config
        this.scene.input.mouse.disableContextMenu();
    
        this.scene.input.on('pointerdown', (pointer) => {
            sx = 0, sy = 0;
            sx = pointer.x;
            sy = pointer.y;
            draw = true;
        });
    
        this.scene.input.on('pointerup', (pointer) => { 
            draw = false;
            let item = this.items[this.step-1];
            this.choices.forEach((choice, i) => {
                let x = choice.x, y = choice.y;
                let ellipse = (((x-this.ellipse.x)*(x-this.ellipse.x))/
                    (this.ellipse.w*this.ellipse.w)) + (((y-this.ellipse.y)*
                    (y-this.ellipse.y))/(this.ellipse.h*this.ellipse.h));
                if (ellipse < 1) this.answer.push(choice);
            });

            if (this.answer.length === 1) {
                this.ellipse.x = this.answer[0].x;
                this.ellipse.y = this.answer[0].y-5;
                this.ellipse.w = 420;
                this.ellipse.h = 230;
                this.graphics.clear().strokeEllipse(
                    this.ellipse.x, this.ellipse.y,
                    this.ellipse.w, this.ellipse.h );
            } else {
                this.answer = [];
                this.graphics.clear();
            }
        });
        this.scene.input.on('pointermove', (pointer) => {
            if (draw && pointer.noButtonDown() === false) {
                this.scene.children.bringToTop(this.graphics);
                this.graphics.clear();
                if (Math.abs(pointer.x - sx) < 400 ) {
                    this.ellipse.x = (pointer.x + sx)/2;
                    this.ellipse.w = pointer.x - sx;
                }
                if (Math.abs(pointer.y - sy) < 220 ) {
                    this.ellipse.y = (pointer.y + sy)/2;
                    this.ellipse.h = pointer.y - sy;
                }

                // Draw
                this.graphics.strokeEllipse(
                    this.ellipse.x, this.ellipse.y,
                    this.ellipse.w, this.ellipse.h );
            }
        });
    }
}

class Item extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);
        let sprite = 'gm3_e4_assets';
        this.clicked = false;
        this.item = scene.add.sprite(0, 0, sprite, data.item).setScale(0.9);
        this.bubble = scene.add.sprite(data.bubbleX, data.bubbleY, sprite, data.bubble);
        this.txt = this.scene.add.text(data.bubbleX, data.bubbleY-50, data.name, { align:'center',
            color:'#000000', fontSize:'6.33em', fontFamily:'Font_Main', lineSpacing:-10, 
            wordWrap:{width:this.bubble.width-80} }).setOrigin(0.5, 0.5);
        this.check = scene.add.sprite(data.checkX, data.checkY, sprite, 'check1')
            .setScale(0.88).setVisible(false);

        this.pointerover = scene.add.container(0, 0).setVisible(false)
            .add([this.bubble, this.txt]);
        this.add([this.item, this.pointerover, this.check]);
        this.setSize(this.item.width, this.item.height).setInteractive({useHandCursor:true})
            .on('pointerover', () => {
                this.pointerover.setVisible(true);
                this.grow.restart();
            }).on('pointerout', () => {
                this.pointerover.setVisible(false);
                this.shrink.restart();
            }).on('pointerdown', () => {
                this.clicked = true;
                this.setFinish();
            });

        // TWEENS - Start
        this.grow = scene.tweens.add({ targets:[this], scale:1.1, duration:111 }).pause();
        this.shrink = scene.tweens.add({ targets:[this], scale:1, duration:111 }).pause();
        // TWEENS - End
    }

    setFinish (set=true) 
    {
        this.check.setVisible(set);
    }
}
