import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { GM3_E1 } from "../../DATA.js";

export class Exercise1Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm3_e1'
        });
    }



    init () 
    {
        this.GM3_E1 = {
            DOM_INPUT: `
                <input type="text" id="main" maxlength="25" class="text-3xl p-5 rounded-lg">`
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.narrator = new Narrator(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        let narrator_step = 1;
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 50, 'Family Structures')
            .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 220, `There can be lots of different people in our lives. ${
                '\n'}We may see some people more than others, we may feel ${
                '\n'}closer to other people and sometimes we can forget ${
                '\n'}who we have in our lives, who we can talk to ${
                '\n'}or ask for help in hard times.`);
        this.narrator.btn.on('pointerdown', () => {
            if (narrator_step === 1) {
                this.narrator.clearText().addText1(0, 50, 'Family Structures')
                    .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 220, `Chose the figures of people who are in your life and ${
                        '\n'}place them where they fit for you. For example, your ${
                        '\n'}Inner circle is the people closest to you. This does not ${
                        '\n'}have to be the people who we see the most, this ${
                        '\n'}can be the people we feel the closest to. ${
                        '\n\n'}Your outer circle are people further away from you. ${
                        '\n'}Who would you put where?`);
            } else {
                this.narrator.clearText().addText1(0, 50, 'Family Structures')
                    .addText2(0, 140, 'Instructions...', '#3AA69D')
                    .addText3(0, 190, `[color=#275eb7]Drag[/color] the ${
                        ''}family members to either your [color=#275eb7]immediate family ${
                        '\n'}circle[/color] or your [color=#275eb7]extended family circle${
                        ''}[/color]. Your counsellor \nwill help you to understand what these are.`)
                    .addText3(0, 369, `Click the [color=#275eb7]Edit[/color] button if you want ${
                        ''}to change \nthe name of a family member.`)
                    .addText3(0, 490, `Click [color=#275eb7]Save[/color] to download your ${
                        ''}family structure.`)
                    .addText3(0, 560, `When you have finished, click the [color=#275eb7]Continue${
                        ''}[/color] ${'\n'}button for a fun challenge.`);
    
                this.narrator.btn.removeListener('pointerdown', 
                    this.narrator.btn.listeners('pointerdown')[1]);
                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            }
            narrator_step++;
        });
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            setTimeout(() => {this.gameplay.start();}, 500);
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg1 = this.add.image(scale.width/2, scale.height/2, 'bg_gm3_e1');
        let bg2 = this.add.image(scale.width/2, scale.height/2, 'bg_gm1_e6').setVisible(false);
        this.gameplay = new Gameplay(this, {
            bg1:bg1, bg2:bg2,
        });
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
        this.characters_choices = [];
        this.characters_dropped = [];
        this.character = false;
        this.step = 1;
        this.score = 0;

        // COMPONENTS
        this.bg1 = components.bg1;
        this.bg2 = components.bg2;

        this.txt_results = scene.add.text(scene.scale.width/2, scene.scale.height-140, 
            `Sometimes adults who are supposed to help children can hurt us. ${
            '\n'}Tell someone if this is happening to you.`, { align:'center', 
            color:'#ffffff', fontSize:'6em', fontFamily:'Font_Main', 
            stroke:'#000000', strokeThickness:5, lineSpacing:-20 })
            .setOrigin(0.5, 0.5).setVisible(false);

        // POPUP EDIT
        this.popup = new Popup(scene).window_setSize(800, 600);
        this.popup.edit = () => {
            this.popup.dom_input.getChildByID('main').value = this.character.getByName('text').text;
            this.popup.intro.once('complete', () => {
                this.popup.dom_input.setVisible(true);
                this.popup.btn_save.setVisible(true);
            }).once('active', () => this.popup.btn_ok.setVisible(false));
            this.popup.exit.once('active', () => {
                this.popup.dom_input.setVisible(false);
                this.popup.btn_save.setVisible(false);
            }).once('complete', () => this.popup.btn_ok.setVisible(true));
            this.popup.show('Enter Name');
        }
        this.popup.dom_input = this.scene.add.dom(0, -25)
            .createFromHTML(this.scene.GM3_E1.DOM_INPUT).setVisible(false);
        this.popup.btn_save = new Button(this.scene, 0, 150, {txt:'Save'})
            .setButton('purple').setVisible(false).on('pointerdown', () => {
                if (this.popup.dom_input.getChildByID('main').value.trim() !== '') {
                    this.character.getByName('text').setText(
                        this.popup.dom_input.getChildByID('main').value
                    );
                    this.character.data.set('circle', 'custom');
                    this.scene.input.setDraggable(this.character);
                    this.popup.dom_input.getChildByID('main').value = '';
                    this.popup.exit.restart();
                }
            });
        this.popup.add([this.popup.dom_input, this.popup.btn_save]);
        this.initialize();
    }

    initialize () 
    {
        this.circles_dropzones = this.scene.add.container(0, 0);
        GM3_E1.CIRCLES1.forEach((c) => {
            let circle = new Circle(this.scene, this.scene.scale.width/2+c.x,
                this.scene.scale.height/2+c.y, {data:c});
            this.circles_dropzones.add(circle);
        });

        this.btn_continue = new Button(this.scene, this.scene.scale.width-300, 
            this.scene.scale.height-150, {txt:'Continue >'})
            .setVisible(false).on('pointerdown', () => {
                let length = (this.step === 1) ? 1:12;
                if (this.characters_dropped.length >= length) this.continue();
            });
        this.btn_save = new Button(this.scene, this.scene.scale.width-575, 
            this.scene.scale.height-150, {w:220, txt:'Save'}).setButton('green')
            .setVisible(false).on('pointerdown', () => {
                this.scene.menu.show(false);
                this.snapshot();
                setTimeout(() => this.scene.menu.show(true), 1000);
            });
        this.btn_finish = new Button(this.scene, this.scene.scale.width-180, 
            this.scene.scale.height-100, {txt:'Finish'}).setButton()
            .setVisible(false).on('pointerdown', () => {
                this.popup.challenge_finish(`Well Done!`, `You got ${this.score} out of 12 correct${
                    '\n\n'}If you want to have another go, click [color=#275eb7]Retry[/color].${
                    '\n\n'}Otherwise, click the [color=#275eb7]Continue[/color] button.`, {
                        retry: () => { this.step=1; this.continue(); },
                        continue: () => { this.popup.btn_retry.destroy(); this.finish(); }
                    });
            });
    }

    start () 
    {
        GM3_E1.CHARACTERS1.forEach((item, i) => {
            let data = JSON.parse(JSON.stringify(item));
            data.frame = 'item'+i;
            let character = new Character(this.scene, data).setName(data.name)
                .on('pointerdown',  () => {
                    if (!character.input.draggable)
                        this.popup.show('Whoops!', 'Make sure you give them a name first.');
                }).on('dragstart', () => {
                    this.scene.children.bringToTop(character);
                }).on('drag', (pointer, dragX, dragY) => {
                    character.setPosition(dragX, dragY);
                }).on('dragend',  (pointer, dragX, dragY, dropped) => {
                    if (!dropped) {
                        character.setPosition(data.x, data.y).setScale(1);
                        if (character.data.get('dropped')) {
                            this.characters_dropped.splice(this.characters_dropped.length-1, 1);
                            character.data.set('dropped', false);
                        }
                    }
                }).on('drop', (pointer, dropZone) => {
                    character.setScale(0.75);
                    if (!character.data.get('dropped')) this.characters_dropped.push(character);
                    character.data.set('dropped', dropZone.parentContainer.data.get('circle'));
                });
            character.edit.on('pointerdown', () => {
                this.character = character; this.popup.edit();
            });
            this.characters_choices.push(character);
        });
        this.btn_continue.setVisible(true);
        this.btn_save.setVisible(true);
    }

    finish () 
    {
        this.scene.loader.show();
        this.scene.api.usersubmodule_create({
            module_key:'gm3', submodule_key:'gm3_e1', score:this.score*100, data:{data:null}
        }).then(res => {
            this.scene.loader.show(false);
            this.popup.finish(`Congratulations!`, `You have completed this exercise.\n\n${
                ''}You got [color=#275eb7]${this.score} out of 12 correct[/color] ${
                ''}\nand have earned [color=#275eb7]${this.score*100} points[/color] ${
                ''}for completing this exercise.`);
        });
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

        let scale = this.scene.scale;
        this.scene.game.renderer.snapshotArea(50, 33, scale.width/2+80, scale.height-66,
            (image) => { exportCanvasAsPNG(canvas, 'Family Structures', image.src); }
        );
    }

    continue () 
    {
        this.bg2.setVisible(false);
        this.btn_continue.setVisible(false);
        this.btn_save.setVisible(false);
        this.btn_finish.setVisible(false);
        this.txt_results.setVisible(false);
        if (this.step === 1) {
            GM3_E1.CHARACTERS2.forEach((c, i) => {
                let character = this.characters_choices[i];
                character.setPart2(c);
            });
            GM3_E1.CIRCLES2.forEach((circle, i) => {
                let container = this.circles_dropzones.list[i];
                container.text.setText(circle.name);
                container.setVisible(true);
            });
            this.characters_dropped.splice(0, this.characters_dropped.length);
            this.score = 0;
            this.step++;

            this.scene.narrator.btn.btn_setText('Start', '5em');
            this.scene.narrator.setText(`Challenge Time!`,
                `See if you can drag the items into the correct circle.\n${
                '\n'}Are they friends of the family or not safe?\n${
                '\n'}Click [color=#275eb7]Start[/color] when you are ready to try this challenge`)
                .show();
            this.scene.narrator.exit.once('complete', () => {
                this.btn_continue.setVisible(true);
                this.btn_save.setVisible(true);
                GM3_E1.CHARACTERS2.forEach((character, i) => {
                    this.characters_choices[i].setVisible(true);
                });
            });
        } else {
            this.bg2.setVisible(true);
            this.txt_results.setVisible(true);
            let x = this.scene.scale.width/2-400, y = 150;
            this.btn_finish.setVisible(true);
            this.circles_dropzones.list.forEach((circle) => circle.setVisible(false));
            this.characters_dropped.forEach((character, i) => {
                let feedback = '', feedback_color = '';
                if (character.data.get('circle') === character.data.get('dropped')) {
                    this.score++;
                    feedback = '✓'; feedback_color = '#009432';
                } else {
                    feedback = 'x'; feedback_color = '#ff0000';
                }
                if ((i+1)%7 === 0) {
                    x = this.scene.scale.width/2+250; y = 150;
                }
                character.setFinish({x:x, y:y, feedback:feedback, feedback_color:feedback_color});
                y += 120;
            });
        }
    }
}

class Character extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setDataEnabled();
        scene.add.existing(this);

        this.sprite = scene.add.image(0, 0, 'gm3_e1_items', data.frame);
        this.text = scene.add.text(0, 0, data.name, { align:'left', color:'#000000',
            fontSize:'5em', fontFamily:'Font_Main', wordWrap:{width:200}, stroke:'#ffffff',
            strokeThickness:5 }).setOrigin(0.5, 0.5).setName('text');
        this.edit = scene.add.text(this.sprite.displayWidth/2.3, this.sprite.displayHeight/-2.1,
            'Edit', { align:'center', color:'#000000', fontSize:'3.5em', fontFamily:'Font_Main',
            wordWrap:{width:200}, stroke:'#ffffff', strokeThickness:5 }).setOrigin(1, 0)
            .setInteractive({useHandCursor:true});
        this.feedback_text = this.scene.add.text(180, 0, 'Feedback', { wordWrap:{width:500},
            fontSize:'8em',fontFamily:'Font_Main', stroke:'#ffffff', strokeThickness:2 })
            .setOrigin(0, 0.5).setName('text').setVisible(false);
        this.add([this.sprite, this.text, this.edit, this.feedback_text])
            .setSize(this.sprite.displayWidth, this.sprite.displayHeight)
            .setInteractive({useHandCursor:true});
        // scene.input.enableDebug(this);
        // scene.input.enableDebug(this.edit);
        this.data.set(data);
        if (!data.rename) scene.input.setDraggable(this);
    }

    setPart2 (data={}) 
    {
        this.feedback_text.setVisible(false);
        this.setPosition(data.x, data.y).setScale(1).setVisible(false);
        this.text.setText(data.name);
        this.edit.setVisible(false);
        this.setInteractive({useHandCursor:true});
        this.data.set('circle', data.circle);
        this.data.set('dropped', false);
        this.scene.input.setDraggable(this);
    }

    setFinish (data={}) 
    {
        this.feedback_text.setText(data.feedback).setColor(data.feedback_color).setVisible(true);
        this.disableInteractive(false).setPosition(data.x, data.y).setScale(1).setVisible(true);
        this.text.setFontSize('5em');
    }
}

class Circle extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y).setDataEnabled();
        scene.add.existing(this);

        let data = args.data || {};
        this.text = scene.add.text(0, data.textY, data.name, { align:'center', color:'#000000',
            fontSize:'6.9em', fontFamily:'Font_Header', wordWrap:{width:200}, stroke:'#ffffff',
            strokeThickness:5 }).setOrigin(0.5, 0.5).setName('text');
        this.zone = scene.add.zone(0, 0, 100, 100).setCircleDropZone(data.radius);
        this.graphics = scene.add.graphics().lineStyle(5, 0xffff00);
        // this.graphics.strokeCircle(0, 0, this.zone.input.hitArea.radius);

        this.add([this.text, this.zone, this.graphics]);
        this.data.set(data);
    }
}
