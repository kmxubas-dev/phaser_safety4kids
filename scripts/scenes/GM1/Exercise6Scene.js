import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Video } from "../../classes/Video.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";

export class Exercise6Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e6'
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
        this.popup = new Popup(this).window_setSize(800, 550);
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 25, 'The Feel Good File')
            .addText2(0, 120, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 200, `Sometimes when we are feeling sad or angry, ${
                '\n'}we can feel down and feel bad about ourselves. ${
                '\n'}We can focus on the things we feel we don’t so well, ${
                '\n'}or maybe someone in our lives says hurtful things ${
                '\n'}to us that make us think we are no good. It is ${
                '\n'}important to remember that we all have ${
                '\n'}strengths and things that we are good at.`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(0, 25, 'The Feel Good File')
                .addText2(0, 100, 'Instructions', '#3AA69D')
                .addText3(0, 170, `Drag items from the kraft kit on to your Feel Good File ${
                    '\n'}to decorate it.`)
                .addText3(0, 290, `There are tools to help you [color=#275eb7]change the colours${
                    ''}[/color] and [color=#275eb7]size[/color] \nof the kraft items.`)
                .addText3(0, 410, `You can also write things [color=#275eb7]${
                    ''}on the inside[/color].`)
                .addText3(0, 490, `Click the [color=#275eb7]Save[/color] button to ${
                    ''}download your Feel Good File.`)
                .addText3(0, 570, `When you have finished, click the [color=#275eb7]${
                    ''}Continue[/color] button.`);

            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        // this.animation_video = new Video(this, {title:'The Feel Good File'}).setAlpha(0);
        // this.animation_video.exit.once('active', () => {
            this.narrator.exit.once('complete', () => {
                this.gameplay.start();
            });
        // }).once('complete', () => bg_temporary.destroy());

        this.api.progress_byModule('gm1').then(res => {
            this.loader.show(false);
            // this.animation_video.setDepth(1).show().play();
            if (res.progress < 5) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm1_e6');
        let board = this.add.image(scale.width-300, scale.height/2+50, 'gm1_e6_assets', 'board');
        let craftingbox = new Craftingbox(this, {x:345, y:scale.height/2+15});
        let file_outside = new FileOutside(this, {x:scale.width/2+45, y:scale.height/2});
        let file_inside = new FileInside(this, {x:scale.width/2-255, y:scale.height/2+25})
            .setVisible(false);

        // let bg_temporary = this.add.image(scale.width/2, scale.height/2, 'bg');

        this.gameplay = new Gameplay(this, {
            craftingbox:craftingbox, file_outside:file_outside, file_inside:file_inside
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
        this.sticker_new;
        this.sticker_current;
        let scale = scene.scale;

        // COMPONENTS
        this.craftingbox = components.craftingbox;
        this.file_outside = components.file_outside;
        this.file_inside = components.file_inside;

        this.craftingbox.zones.forEach((zone) => {
            zone.on('pointerdown', (pointer, x, y, event) => {
                if (this.file_outside.items.list.length <= 20) {
                    let object = this.scene.add.container(pointer.x, pointer.y);
                    object.add( this.scene.add.sprite(0, 0, 'gm1_e6_items', zone.name)
                        .setScale(0.5).setName('sprite') );
                    object.add( this.scene.add.rectangle(0, 0,
                            object.getByName('sprite').displayWidth,
                            object.getByName('sprite').displayHeight)
                            .setStrokeStyle(3, 0xFF00FF).setVisible(false).setName('border') );
                    object.setSize( object.getByName('sprite').displayWidth, 
                        object.getByName('sprite').displayHeight)
                        .setInteractive({useHandCursor:true, draggable:true });
                    this.file_outside.items.list.forEach((item) => {
                        item.getByName('border').setVisible(false);
                    });
                    object.getByName('border').setVisible(true);

                    object.on('dragstart', (pointer, dragX, dragY) => {
                        let main = this.actions.getChildByID('main');
                        this.sticker_current = object;
                        this.file_outside.items.list.forEach((item) => {
                            item.getByName('border').setVisible(false);
                        });
                        object.getByName('border').setVisible(true);
                        main.querySelector('#size').value = object.scale;
                    }).on('drag', (pointer, dragX, dragY) => {
                        object.setPosition(dragX, dragY);
                    }).on('dragend', (pointer, dragX, dragY, dropped) => {
                        if (!dropped) {
                            object.x = object.input.dragStartX;
                            object.y = object.input.dragStartY;
                        }
                    });

                    this.sticker_new = object;
                    this.sticker_current = object;
                }
            }).on('drag', (pointer, dragX, dragY) => {
                if (this.file_outside.items.list.length <= 20) {
                    this.sticker_new.setPosition(pointer.x, pointer.y);
                }
            }).on('dragend', (pointer, dragX, dragY, dropped) => {
                if (this.file_outside.items.list.length <= 20) {
                    if (!dropped) {
                        this.sticker_new.destroy();
                    } else {
                        this.sticker_new.x = this.sticker_new.x - this.file_outside.x;
                        this.sticker_new.y = this.sticker_new.y - this.file_outside.y;
                        this.file_outside.items.add(this.sticker_new);
                    }
                }
            });
        });

        this.btn_continue = new Button(scene, scale.width-310, scale.height-180,
            {txt:'Continue >'}).setButton('main_blue').setVisible(false)
            .on('pointerdown', () => {
                scene.popup.confirm('Are you sure you want to continue?', {
                    callback_complete: (tween, targets) => {
                        if (this.scene.popup.confirm_answer ) {
                            this.craftingbox.setVisible(false);
                            this.file_outside.setVisible(false);
                            this.file_inside.setVisible(true);
                            this.btn_continue.setVisible(false);
                            this.btn_affirmations .setVisible(true);
                            this.btn_download.setVisible(true);
                            this.btn_finish.setVisible(true);
                            let main = this.actions.getChildByID('main');
                            main.querySelector('#outside').classList.add('hidden');
                            main.querySelector('#inside').classList.remove('hidden');
                        }
                    }
                });
            });

        this.btn_affirmations = new Button(scene, scale.width-230, scale.height-350,
            {w:200, h:69, txtsize:'4em', txt:'Affirmations'}).setButton('main_purple')
            .setVisible(false).on('pointerdown', () => {
                let main = this.actions.getChildByID('main');
                main.querySelector('#persons_wrapper').classList.add('hidden');
                main.querySelector('#affirmations_wrapper').classList.remove('hidden');
                this.btn_affirmations.setVisible(false);
                this.btn_persons.setVisible(true);
            });
        this.btn_persons = new Button(scene, scale.width-230, scale.height-300,
            {w:200, h:69, txtsize:'4em', txt:'Persons'}).setButton('main_purple')
            .setVisible(false).on('pointerdown', () => {
                let main = this.actions.getChildByID('main');
                main.querySelector('#persons_wrapper').classList.remove('hidden');
                main.querySelector('#affirmations_wrapper').classList.add('hidden');
                this.btn_affirmations.setVisible(true);
                this.btn_persons.setVisible(false);
            });

        this.btn_download = new Button(scene, scale.width-400, scale.height-169,
            {w:169, h:69, txt:'Download'}).setButton('cyan').setVisible(false)
            .on('pointerdown', () => { this.download(); });
        this.btn_finish = new Button(scene, scale.width-225, scale.height-169,
            {w:169, h:69, txt:'Finish >'}).setButton('green').setVisible(false)
            .on('pointerdown', () => {
                this.btn_affirmations .setVisible(false);
                this.btn_persons.setVisible(false);
                this.btn_download.setVisible(false);
                this.btn_finish.setVisible(false);
                this.actions.setVisible(false);
                this.scene.loader.show();
                this.scene.api.usersubmodule_create({
                    module_key:'gm1', submodule_key:'gm1_e6',
                    score:500, data:{data:null}
                }).then(res => {
                    this.scene.loader.show(false);
                    this.scene.popup.finish(`Congratulations!`, 
                    `You have completed this exercise.${
                    '\n\n'}You have earned [color=#275eb7]500 points[/color]${
                    ''} for completing this exercise.`);
                });
            });

        this.actions = scene.add.dom(scale.width-125, 200).createFromCache('dom_gm1_e7')
            .setScale(2).setOrigin(1, 0).setVisible(false);
        this.eventlisteners();
    }

    start () 
    {
        this.actions.setVisible(true);
        this.btn_continue.setVisible(true);
    }

    eventlisteners () 
    {
        let main = this.actions.getChildByID('main');
        let title = main.querySelector('#text_title');
        let color = main.querySelector('#color');
        let size = main.querySelector('#size');
        let text_person = main.querySelectorAll('#text_person');
        let text_affirmations = main.querySelectorAll('#text_affirmations');

        title.addEventListener('keyup', (event) => {
            this.file_outside.txt.setText(title.value);
        });
        color.addEventListener('input', (event) => {
            let r = parseInt(color.value.substr(1,2), 16);
            let g = parseInt(color.value.substr(3,2), 16);
            let b = parseInt(color.value.substr(5,2), 16);
            this.sticker_current.getByName('sprite')
                .setTint(new Phaser.Display.Color(r, g, b).color);
        });
        size.addEventListener('change', (event) => {
            this.sticker_current.setScale(parseFloat(size.value));
        });
        main.querySelector('#btn_forward').addEventListener('click', (event) => {
            this.file_outside.items.moveUp(this.sticker_current);
        });
        main.querySelector('#btn_backward').addEventListener('click', (event) => {
            this.file_outside.items.moveDown(this.sticker_current);
        });
        main.querySelector('#btn_left').addEventListener('click', (event) => {
            this.sticker_current.angle -= 10;
        });
        main.querySelector('#btn_right').addEventListener('click', (event) => {
            this.sticker_current.angle += 10;
        });
        main.querySelector('#btn_destroy').addEventListener('click', (event) => {
            this.sticker_current.destroy();
        });

        text_person.forEach((element, i) => {
            element.addEventListener('keyup', (event) => {
                this.file_inside.getByName('text_person'+i).text = element.value;
            });
        });
        text_affirmations.forEach((element, i) => {
            element.addEventListener('keyup', (event) => {
                this.file_inside.getByName('text_affirmation'+i).text = element.value;
            });
        });
    }

    download () 
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
        this.scene.menu.show(false);
        this.file_outside.setVisible(true);
        this.file_inside.setVisible(false);
        this.scene.game.renderer.snapshotArea(this.scene.scale.width/2-345, 40, 750, 1000,
            function (image) { exportCanvasAsPNG(canvas, 'Feel-good File Front', image.src);
        });
        setTimeout(() => {
            this.file_outside.setVisible(false);
            this.file_inside.setVisible(true);
            this.scene.game.renderer.snapshotArea(55, 100, 1313, 933, (image) => {                
                exportCanvasAsPNG(canvas, 'Feel-good File Inside', image.src);
                this.scene.menu.show();
            });
        }, 1000);
    }
}

class Craftingbox extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        this.base = scene.add.image(0, 0, 'gm1_e6_assets', 'craftingbox');
        this.zones = [
            scene.add.zone(-135, -360, 225, 200).setName('button'),
            scene.add.zone(100, -310, 250, 225).setName('eye'),
            scene.add.zone(-180, -40, 169, 430).setName('popsiclestick'),
            scene.add.zone(5, -5, 205, 369).setName('feather'),
            scene.add.zone(169, 90, 125, 455).setName('stick'),
            scene.add.zone(-75, 240, 350, 125).setName('sequin'),
            scene.add.zone(-25, 380, 440, 140).setName('pipecleaner')
        ];
        this.zones.forEach((zone) => {
            zone.setInteractive({useHandCursor:true, draggable:true});
            // scene.input.enableDebug(zone);
        });
        this.add([this.base]).add(this.zones);
    }
}

class FileOutside extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        this.base = scene.add.image(0, 0, 'gm1_e6_assets', 'folder_outside');
        this.txt = scene.add.text(0, -450, 'Title', { align:'left', color:'#000000',
            wordWrap:{width:630}, fontSize:'10em', fontFamily:'Font_Main' })
            .setOrigin(0.5, 0);
        this.items = scene.add.container(0, 0);
        this.add([this.base, this.items, this.txt])
            .setSize(this.base.displayWidth, this.base.displayHeight)
            .setInteractive({dropZone:true});
    }
}

class FileInside extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        let positions = {
            persons: [-230, -30, 170],
            affirmations: [-220, -120, -20, 80, 180],
        }
        this.base = scene.add.image(0, 0, 'gm1_e6_assets', 'folder_inside');
        this.add([this.base])
            .setSize(this.base.displayWidth, this.base.displayHeight)
            .setInteractive({dropZone:true});
        
        for (let i=0; i<3; i++) {
            this.add(
                this.scene.add.text(-330, positions.persons[i], 'Person', { align:'left',
                color:'#000000', fontSize:'10em', fontFamily:'Font_Main', wordWrap:{width:500},
                stroke:'#ffffff', strokeThickness:5 }).setOrigin(0.5, 0.5).setName('text_person'+i)
            );
        }
        for (let i=0; i<5; i++) {
            this.add(
                this.scene.add.text(300, positions.affirmations[i], 'Affirmation', { align:'left',
                color:'#000000', fontSize:'8em', fontFamily:'Font_Main', wordWrap:{width:500},
                stroke:'#ffffff', strokeThickness:5 }).setOrigin(0.5, 0.5)
                .setName('text_affirmation'+i)
            );
        }
    }
}
