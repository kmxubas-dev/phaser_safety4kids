import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { GM1_E3 as QuizData } from "../../data/QUIZ.js";

export class Exercise3Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e3'
        });
    }



    init () 
    {

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
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(-50, 25, 'Face Masks')
            .addText2(-50, 110, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(-50, 180, `Some emotions, like feeling happy can be much easier to see ${
                '\n'}and to show on our faces. On the inside of your mask paint ${
                '\n'}the feelings that are hard to talk about, feel bad or ‘tricky’. ${
                '\n'}Sometimes we show different emotions on the outside to ${
                '\n'}what we are feeling on the inside. For example, we might smile ${
                '\n'}when we see our mum, even though we are worried about her, ${
                '\n'}because we don’t want her to know that because then she will ${
                '\n'}worry about us! These may be feelings we hide from others ${
                '\n'}as we are worried about getting hurt, in trouble ${
                '\n'}or hurting someone’s feelings.`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(-50, 25, 'Face Masks')
                .addText2(-50, 110, 'Instructions', '#3AA69D')
                .addText3(-50, 200, `Use the [color=#275eb7]colour and brush tools${
                    ''}[/color] on the side to \ndecorate your mask.`)
                .addText3(-50, 320, `You can click [color=#275eb7]Inside[/color] or ${
                    ''}[color=#275eb7]Outside[/color] to change to the ${
                    '\n'}inside or outside of the mask.`)
                .addText3(-50, 450, `Click [color=#275eb7]Save[/color] if you want to ${
                    ''}save your mask.`)
                .addText3(-50, 530, `When you have finished, click the [color=#275eb7]${
                    ''}Continue[/color] button \nto go to the quiz.`);

            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });

        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.initialize();
        });
        this.api.progress_byModule('gm1').then(res => {
            this.loader.show(false);
            if (res.progress < 2) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2, 'bg_gm1_e3');
        let note = this.add.image(scale.width/2-430, 250, 'gm1_e3_note').setScale(0.38);
        let note_txt = this.add.text(scale.width/2-430, 250, 'Outside',
            {align:'center', color:'#000000', fontFamily:'Font_Header', fontSize:'5em'})
            .setOrigin(0.5).setAngle(-4);
        let tools_txt = this.add.text(scale.width/2+535, 210, 'Tools', { align:'center',
            color:'#000000', fontFamily:'Font_Header', fontSize:'6em' }).setOrigin(0.5);
        let tools_dom = this.add.dom(scale.width-118, 360).createFromCache('dom_gm1_e3')
            .setScale(1.48).setOrigin(1, 0).setAlpha(0);
        let btn_inside = new Button(this, this.scale.width-390, this.scale.height/2-240,
            {w:150, txt:'Inside'}).setButton('purple');
        let btn_outside = new Button(this, this.scale.width-220, this.scale.height/2-240,
            {w:150, txt:'Outside'}).setButton('purple');
        let btn_paint = new Button(this, this.scale.width-300, this.scale.height/2+150,
            {w:300, txt:'Paint'}).setButton('purple').setVisible(false);
        let btn_eraser = new Button(this, this.scale.width-300, this.scale.height/2+150,
            {w:300, txt:'Eraser'}).setButton('purple');
        let btn_save = new Button(this, this.scale.width-300, this.scale.height/2+250,
            {w:300, txt:'Save as image'}).setButton('purple');
        let mask = new Mask(this, {x:scale.width/2, y:scale.height/2});

        this.gameplay = new Gameplay(this, {
            frame:frame, bg:bg, note:note, note_txt:note_txt, mask:mask, tools_txt:tools_txt,
            tools_dom:tools_dom, btn_inside:btn_inside, btn_outside:btn_outside,
            btn_paint:btn_paint, btn_eraser:btn_eraser, btn_save:btn_save,
        });

        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = (popup=this.popup) => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'gm1', submodule_key:'gm1_e3', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                popup.finish(`Congratulations!`, `You have completed this exercise. ${
                    '\n\n'}You got [color=#275eb7]${this.quiz.score} out of ${
                    this.quiz.data.get('items').length} answers correct[/color] ${
                    '\n'}and have earned [color=#275eb7]${this.quiz.score*100} ${
                    ''}points[/color] for completing this exercise.`);
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
        this.step = 1;

        // COMPONENTS
        this.frame = components.frame;
        this.bg = components.bg;
        this.note = components.note;
        this.note_txt = components.note_txt;
        this.mask = components.mask;
        this.tools_dom = components.tools_dom;
        this.tools_txt = components.tools_txt;
        this.btn_inside = components.btn_inside;
        this.btn_outside = components.btn_outside;
        this.btn_paint = components.btn_paint;
        this.btn_eraser = components.btn_eraser;
        this.btn_save = components.btn_save;

        this.tools_btns = scene.add.container(0, 0).add([ this.btn_inside, this.btn_outside,
            this.btn_paint, this.btn_eraser, this.btn_save ]).setVisible(false);
    }

    initialize (scene=this.scene, scale=this.scene.scale) 
    {
        this.tools_btns.setVisible(true);
        this.paint = {
            brush:this.scene.textures.getFrame('paint_brush1'),
            color:new Phaser.Display.Color(0, 0, 0).color,
            offsetX:32, offsetY:32, eraser:false
        }
        this.rt1 = scene.add.renderTexture(0, 0, scale.width, scale.height).setVisible(true);
        this.rt2 = scene.add.renderTexture(0, 0, scale.width, scale.height).setVisible(false);
        this.mask.addAt(this.rt1, 2);
        this.mask.addAt(this.rt2, 3);
        this.rt1.setMask(this.rt1.createBitmapMask(this.mask.base));
        this.rt2.setMask(this.rt2.createBitmapMask(this.mask.base));
        this.scene.input.on('pointermove', (pointer) => {
            if (this.step === 1) {
                if (pointer.isDown) {
                    let rt = (this.rt1.visible) ? this.rt1 : this.rt2;
                    if (!this.paint.eraser) {
                        rt.draw(this.paint.brush, pointer.x-this.paint.offsetX, 
                            pointer.y-this.paint.offsetY, 1, this.paint.color);
                    } else {
                        rt.erase(this.paint.brush, pointer.x-this.paint.offsetX, 
                            pointer.y-this.paint.offsetY);
                    }
                }
            }
        });
        this.options_eventlisteners();

        this.cursor_circle = this.scene.add.container(0, 0);
        this.cursor_circle.add( this.scene.add.circle(0, 0, this.paint.brush.width/2)
            .setStrokeStyle(5, 0x2ecc71).setName('circle'));
        this.scene.input.on('pointermove', (pointer) => {
            this.cursor_circle.setPosition(pointer.x, pointer.y);
        });
        this.scene.tweens.add({targets:this.tools_dom, alpha:1, duration:800});
        this.options_exit = this.scene.tweens.add({ targets:this.tools_dom,
            alpha:0, duration:800 }).pause();
    }

    options_eventlisteners () 
    {
        let tools_main = this.tools_dom.getChildByID('main');
        let c = tools_main.querySelector('#c');
        let s = tools_main.querySelector('#s');

        this.btn_inside.on('pointerdown', () => this.mask_switch(true));
        this.btn_outside.on('pointerdown', () => this.mask_switch(false));
        this.btn_paint.on('pointerdown', () => {
            this.paint.eraser = false;
            this.cursor_circle.getByName('circle').setStrokeStyle(5, 0x2ecc71);
            this.btn_paint.setVisible(false); this.btn_eraser.setVisible(true);
        });
        this.btn_eraser.on('pointerdown', () => {
            this.paint.eraser = true;
            this.cursor_circle.getByName('circle').setStrokeStyle(5, 0xff0000);
            this.btn_paint.setVisible(true); this.btn_eraser.setVisible(false);
        });
        this.btn_save.on('pointerdown', () => {
            var canvas;
            let exportCanvasAsPNG = (id, fileName, dataUrl) => {
                var canvasElement = document.getElementById(id);
                var MIME_TYPE = "image/png";
                var imgURL = dataUrl;
                var dlLink = document.createElement('a');
                dlLink.download = fileName;
                dlLink.href = imgURL;
                dlLink.dataset.downloadurl = [
                    MIME_TYPE, dlLink.download, dlLink.href ].join(':');
                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            }
            this.cursor_circle.setVisible(false);
            this.mask_switch(false);
            this.scene.game.renderer.snapshotArea(400, 25, 950, this.scene.scale.height-60,
                (image) => { exportCanvasAsPNG(canvas, 'Face Masks Outside', image.src); });
            setTimeout(() => {
                this.mask_switch(true);
                this.options_exit.restart();
                this.scene.game.renderer.snapshotArea(400, 25, 950, this.scene.scale.height-60,
                    (image) => exportCanvasAsPNG(canvas, 'Face Masks Inside', image.src));
            }, 1000);
            setTimeout(() => {
                this.step++;
                this.note.destroy();
                this.note_txt.destroy();
                this.scene.quiz.start();
            }, 3000);
        });

        s.addEventListener('change', (event) => {
            this.paint.brush.width = parseInt(s.value);
            this.paint.brush.height = parseInt(s.value);
            this.paint.offsetX = parseInt(s.value)/2;
            this.paint.offsetY = parseInt(s.value)/2;
            this.cursor_circle.getByName('circle').setRadius(this.paint.brush.width/2);
        });
        c.addEventListener('change', (event) => {
            let color = c.value;
            let r = parseInt(color.substr(1,2), 16);
            let g = parseInt(color.substr(3,2), 16);
            let b = parseInt(color.substr(5,2), 16);
            this.paint.color = new Phaser.Display.Color(b, g, r).color;
        });
    }

    mask_switch (set) 
    {
        let orientation = (!set) ? 'frnt':'bck';
        this.mask.setOrientation(orientation);
        this.note_txt.text = (!set) ? 'Outside':'Inside';
        this.rt1.setVisible(!set);
        this.rt2.setVisible(set);
    }
}

class Mask extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, 0, 0);
        scene.add.existing(this);
        let sprite = 'gm1_e3_mask';
        this.orientation = 'frnt';
        this.base = scene.add.sprite(data.x, data.y, sprite, 'frnt_base');
        this.outline = scene.add.sprite(data.x, data.y, sprite, 'frnt_outline');
        this.shadow1 = scene.add.sprite(data.x, data.y, sprite, 'frnt_shadow1');
        this.shadow2 = scene.add.sprite(data.x, data.y, sprite, 'frnt_shadow2');
        this.shadow3 = scene.add.sprite(data.x, data.y, sprite, 'frnt_shadow3');
        this.shadow = scene.add.sprite(data.x-90, data.y-25, sprite, 'shadow').setAlpha(0.8);
        this.add([this.shadow, this.base, this.shadow1, this.shadow2, this.shadow3, this.outline]);

        // TWEENS - Start
        this.shake = scene.tweens.add({ targets:[this],
            angle:2, duration:100, yoyo:true, repeat:2
        }).pause();
        // TWEENS - End
    }

    setOrientation (orientation='frnt') 
    {
        this.orientation = orientation;
        this.outline.setFrame(this.orientation+'_outline');
        this.shadow1.setFrame(this.orientation+'_shadow1');
        this.shadow2.setFrame(this.orientation+'_shadow2');
        this.shadow3.setFrame(this.orientation+'_shadow3');
    }
}
