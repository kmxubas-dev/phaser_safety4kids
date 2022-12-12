import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { ProgressBar } from "../../classes/Progress.js";
import { GM3_E4 } from "../../DATA.js";

export class Exercise3Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm3_e3'
        });
    }



    init () 
    {
        this.data_dom = {
            input: `<input type="text" maxlength="25" id="input" class="rounded-lg border-gray-300
                border-0 border-b-8" style="width:350px; padding:0px; font-family:Font_Header;
                font-size:4em; background:transparent;">`
        }
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
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(-25, 25, 'Letter to My Parents')
            .addText2(-25, 110, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(-25, 200, `Sometimes children or adults have something on their ${
                '\n'}mind that they wish they could say. It might not ${
                '\n'}always be safe to say it. Writing it down in a journal ${
                '\n'}or in a letter can be helpful to you. If it is safe ${
                '\n'}and you would like to give this letter to an adult, ${
                '\n'}you can do that. If it is not safe, keep it private ${
                '\n'}or do not save the letter.`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(-25, 25, 'Letter to My Parents')
                .addText2(-25, 110, 'Instructions', '#3AA69D')
                .addText3(-25, 180, `In this exercise, you will write a letter to your parents.`)
                .addText3(-25, 250, `First put in the name of the person you want to write the ${
                    '\n'}letter to, then put in your name.`)
                .addText3(-25, 369, `Here are some things you might want to include, click the ${
                    '\n'}[color=#275eb7]Yes[/color] button to include it, click the ${
                    ''}[color=#275eb7]No[/color] button to skip it.`)
                .addText3(-25, 490, `Click the [color=#275eb7]Build Letter[/color] button to make ${
                    ''}your letter. You can \nthen save it if you want by clicking the ${
                    ''}[color=#275eb7]Save[/color] button.`)
                .addText3(-25, 610, `When you have finished, click the ${
                    ''}[color=#275eb7]Continue[/color] \nbutton.`);

            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            setTimeout(() => {this.gameplay.start();}, 500);
        });
        this.api.progress_byModule('gm3').then(res => { 
            this.loader.show(false);
            if (res.progress < 2) this.scene.start('gm_interface');
        });
        // INTRO - End

        let scale = this.scale;
        let messages = [];
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000).setScrollFactor(0);
        let bg = this.add.image(scale.width/2, scale.height/2, 'bg_gm3_e3');
        let pad = this.add.sprite(scale.width/2-100, scale.height/2, 'gm3_e3_assets', 'pad2');
        GM3_E4.MESSAGES.forEach((s) => {
            let data = { txt:s.content, x:scale.width/2-100, y:scale.height/2-80 };
            let container = new Message(this, data).setVisible(true);
            messages.push(container);
        });
        let pad2 = this.add.sprite(scale.width/2-100, scale.height/2, 'gm3_e3_assets', 'pad3');
        let miniboard = this.add.sprite(scale.width-180, scale.height-230,
            'gm3_e3_assets', 'miniboard');
        let arrow = this.add.image(175, 475, 'gm3_e3_assets', 'arrow').setVisible(false);
        this.tweens.add({targets:arrow, x:arrow.x-20, duration:500, yoyo:true, loop:-1});

        this.gameplay = new Gameplay(this, {
            bg:bg, pad:pad, miniboard:miniboard, messages:messages, arrow:arrow
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
        this.message_count = 0;
        this.date = new Date().toLocaleString('en-AU', {
            year:'numeric', month:'long', day:'numeric'
        });

        // COMPONENTS
        this.bg = components.bg;
        this.pad = components.pad;
        this.miniboard = components.miniboard;
        this.messages = components.messages;
        this.arrow = components.arrow;
        
        this.initialize_part1();
        this.initialize_part2();
        
        this.messages.forEach((message) => {
            message.intro_bottom.on('active', () => {
                this.include_confirm.setVisible(false);
            }).on('complete', () => {
                this.include_confirm.setVisible(true);
            });
            message.intro_top.on('active', () => {
                this.include_confirm.setVisible(false);
            }).on('complete', () => {
                this.include_confirm.setVisible(true);
            });
        });

        this.input_text = this.scene.add.dom(315, 238).createFromHTML(this.scene.data_dom.input)
            .setOrigin(0, 0.5).setVisible(false);
        this.input_text1 = this.scene.add.dom(this.scene.scale.width-455, 238)
            .createFromHTML(this.scene.data_dom.input).setOrigin(1, 0.5).setVisible(false);
        
    }

    start () 
    {
        this.input_text.setVisible(true);
        this.input_text1.setVisible(true);
        this.texts.setVisible(true);
        this.progressbar.setVisible(true);
        this.btn_back.setVisible(true);
        this.letter.setVisible(false);
        this.build_buttons.setVisible(false);
        this.arrow.setVisible(true);
        this.messages.forEach((message) => {
            message.setVisible(true).setAlpha(0);
        });

        this.step = 0;
        this.loadItem();
    }

    build_letter () 
    {
        let letter_message = '';
        let letter_to = this.input_text.getChildByID('input').value;
        let letter_name = this.input_text1.getChildByID('input').value;
        if (letter_to !== '' && letter_name !== '' && this.message_count > 0) {
            this.letter.setVisible(true);
            this.input_text.setVisible(false);
            this.input_text1.setVisible(false);
            this.build_buttons.setVisible(true);
            
            this.include_confirm.setVisible(false);
            this.texts.setVisible(false);
            this.arrow.setVisible(false);
            this.progressbar.setVisible(false);
            this.btn_back.setVisible(false);
            this.messages.forEach((message) => {
                message.setVisible(false);
                if (message.letter_include) {
                    letter_message += message.txt.text+' ';
                }
            });

            this.letter.txt_date.setText(this.date);
            this.letter.txt_to.setText('Dear '+letter_to+',');
            this.letter.txt_message.setText(letter_message);
            this.letter.txt_from.setText(letter_name);
        } else {
            this.scene.popup.show(`Please make sure`,
                `-to include at least one message${
                '\n'} -to put who are you writing this message${
                '\n'} -to put your name`);
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

        this.scene.game.renderer.snapshotArea(130, 69, 1450, 930,function (image) {                
            exportCanvasAsPNG(canvas, 'Letter to my Parents', image.src);
        });
    }

    loadItem (direction=1, step=this.step) 
    {
        if (direction === 1 && step < this.messages.length) {
            this.step++
            this.messages[step].intro_bottom.restart();
            if (step !== 0) {
                this.messages[step-1].exit_top.restart();
            }
        } else if (direction === -1 && step > 1) {
            step = --this.step;
            this.messages[step].exit_bottom.restart();
            this.messages[step-1].intro_top.restart();
        } 
        if (step === this.messages.length) {
            this.scene.popup.intro.once('active', () => {
                this.input_text.setVisible(false);
                this.input_text1.setVisible(false);
            });
            this.scene.popup.exit.once('complete', () => {
                this.input_text.setVisible(true);
                this.input_text1.setVisible(true);
            });
            this.scene.popup.confirm(
                'Do you want to proceed on building your letter?',{
                    callback_complete: () => {
                        if (this.scene.popup.confirm_answer) this.build_letter();
                    }
                }
            );
        }
        this.progressbar.drawProgress(GM3_E4.MESSAGES.length, this.step);
    }

    initialize_part1 () 
    {
        let text_date = this.scene.add.text(-750, -390, this.date, { align:'center',
            color:'#000000', fontSize:'6em', fontFamily:'Font_Header',
            wordWrap:{width:500} }).setOrigin(0, 0.5);
        let text_to = this.scene.add.text(-750, -300, 'Dear', { align:'center',
            color:'#000000', fontSize:'6em', fontFamily:'Font_Header',
            wordWrap:{width:500} }).setOrigin(0, 0.5);
        let text_name = this.scene.add.text(-55, -300, 'Your Name', { align:'center',
            color:'#000000', fontSize:'6em', fontFamily:'Font_Header',
            wordWrap:{width:500} }).setOrigin(0, 0.5);
        this.texts = this.scene.add.container(this.scene.scale.width/2, this.scene.scale.height/2);
        this.texts.add([text_date, text_to, text_name]).setVisible(false);

        let include_txt = this.scene.add.text(0, 0, 'Do you want to include this in your letter?',
            { align:'center', color:'#000000', fontSize:'6.9em', fontFamily:'Font_Main',
            wordWrap:{width:800} }).setOrigin(0.5, 0.5);
        let include_yes = new Button(this.scene, -150, 100, {txt:'Yes'})
            .setButton('green').on('pointerdown', () => {
                let message = this.messages[this.step-1];
                if (!message.letter_include) this.message_count++;
                message.letter_include = true;
                this.loadItem();
            });
        let include_no = new Button(this.scene, 150, 100, {txt:'No'})
            .setButton('main_purple').on('pointerdown', () => {
                let message = this.messages[this.step-1];
                if (message.letter_include) this.message_count--;
                message.letter_include = false;
                this.loadItem();
            });
        this.include_confirm = this.scene.add.container(this.scene.scale.width/2-100, 
            this.scene.scale.height/2+80).setVisible(false)
            .add([include_txt, include_yes, include_no]);

        this.progressbar = new ProgressBar(this.scene, this.scene.scale.width/2-100, 
            this.scene.scale.height-200).setVisible(false)
            .drawProgress(GM3_E4.MESSAGES.length, this.step);

        this.btn_back = new Button(this.scene, 330, this.scene.scale.height-175, 
            {txt:'< Previous'}).setButton().setVisible(false)
            .on('pointerdown', () => { this.loadItem(-1); });
    }

    initialize_part2 () 
    {
        this.letter = new Letter(this.scene, {x:this.scene.scale.width/2-100,
            y:this.scene.scale.height/2}).setVisible(false);

        let btn_save = new Button(this.scene, 10, this.scene.scale.height-330, { w:200,
            txt:'Save' }).setButton('green').on('pointerdown', () => this.snapshot());
        let btn_finish = new Button(this.scene, 10, this.scene.scale.height-230,
            {w:200, txt:'Continue >', txtsize:'4.5em'}).setButton().on('pointerdown', () => {
                this.scene.loader.show();
                this.scene.api.usersubmodule_create({
                    module_key:'gm3', submodule_key:'gm3_e3', score:500, data:{data:null}
                }).then(res => {
                    this.scene.loader.show(false);
                    this.scene.popup.finish(`Congratulations!`, 
                        `You have completed this exercise. \nYou have earned ${
                        ''}[color=#275eb7]500 points[/color] for completing this exercise.`);
                });
            });
        let btn_remake = new Button(this.scene, 10, this.scene.scale.height-130, { w:200, 
            txt:'Remake' }).setButton('main_purple').on('pointerdown', () => this.start());
        this.build_buttons = this.scene.add.container(this.scene.scale.width-200, 0)
            .setVisible(false).add([btn_remake, btn_save, btn_finish]);
    }
}

class Message extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setAlpha(0).setDataEnabled();
        scene.add.existing(this);

        this.txt = scene.add.text(0, 3, data.txt, { align:'left', color:'#000000',
            fontSize:'6.6em', fontFamily:'Font_Header', wordWrap:{width:1000} })
            .setOrigin(0.5, 0.5);
        this.add([this.txt]);
        
        this.intro_top = scene.tweens.add({ targets:this, duration:1000,
            y:{from:344, to:444}, alpha:{from:0, to:1} }).pause();
        this.intro_bottom = scene.tweens.add({ targets:this, duration:1000,
            y:{from:544, to:444}, alpha:{from:0, to:1} }).pause();
        this.exit_top = scene.tweens.add({ targets:this, duration:1000,
            y:{from:444, to:344}, alpha:{from:1, to:0} }).pause();
        this.exit_bottom = scene.tweens.add({ targets:this, duration:1000,
            y:{from:444, to:544}, alpha:{from:1, to:0} }).pause();
    }
}

class Letter extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setDataEnabled();
        scene.add.existing(this);

        this.bg = scene.add.image(0, 0, 'gm3_e3_assets', 'pad');
        this.txt_date = scene.add.text(-633, -400, '', { align:'left', color:'#000000',
            fontSize:'6.6em', fontFamily:'Font_Main', wordWrap:{width:500} }).setOrigin(0, 0);
        this.txt_to = scene.add.text(-633, -320, '', { align:'left', color:'#000000',
            fontSize:'6.6em', fontFamily:'Font_Main', wordWrap:{width:500} }).setOrigin(0, 0);
        this.txt_message = scene.add.text(-633, -220, '', { align:'left', color:'#000000',
            fontSize:'6.222em', fontFamily:'Font_Main', lineSpacing:-15, wordWrap:{width:1200} })
            .setOrigin(0, 0);
        this.txt_from = scene.add.text(-633, 255, '', { align:'left', color:'#000000',
            fontSize:'6.6em', fontFamily:'Font_Main', wordWrap:{width:500} }).setOrigin(0, 0);
        this.add([this.bg, this.txt_date, this.txt_to, this.txt_message, this.txt_from]);
    }
}
