import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";

export class Exercise2Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm2_e2'
        });
    }



    init () 
    {
        this.GM2_E2 = {
            PEOPLE: [
               { name:'item1', text:'Mum',    x:1610, y:280,  frame:'1' },
               { name:'item2', text:'Dad',    x:1610, y:410,  frame:'2' },
               { name:'item3', text:'Gran',   x:1610, y:540,  frame:'3' },
               { name:'item4', text:'Sister',  x:1610, y:670, frame:'4' },
               { name:'item5', text:'Brother', x:1610, y:800, frame:'5' },
            ],
            DOM_INPUT_TEXT: `
                <input type="text" id="main" maxlength="20" class="text-3xl p-5 rounded-lg">`
        }
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
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 50, 'The Safety Hand')
            .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 220, `It is important to have people we can talk to when we ${
                '\n'}are having hard times, feeling unsafe, unhappy or afraid. ${
                '\n'}The Safety hand helps us to name the people we can rely on, ${
                '\n'}like members of your family, friends or other safe adults, ${
                '\n'}like community members.`); 
        this.narrator.btn.on('pointerdown', () => {
            this.narrator.clearText().addText1(0, 50, 'The Safety Hand')
                .addText2(0, 140, 'Instructions', '#3AA69D')
                .addText3(0, 200, `Drag and drop the coloured tabs on to the fingers of the ${
                    '\n'} Safety Hand, these are the members of your family who you ${
                    '\n'}can talk to when you feel uncomfortable or scared.`)
                .addText3(0, 369, `You can change the names by clicking the [color=#275eb7]${
                    ''}Edit[/color] buttons, ${'\n'}then [color=#275eb7]typing the name${
                    ''}[/color] then clicking [color=#275eb7]Save[/color].`)
                .addText3(0, 500, `If you want to save your Safety Hand, click the ${
                    ''}[color=#275eb7]Save[/color] button.`)
                .addText3(0, 590, `Click the [color=#275eb7]Continue[/color] ${
                    ''}button to finish the exercise.`);
            this.narrator.btn.removeListener('pointerdown', 
                this.narrator.btn.listeners('pointerdown')[1]);
            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.initialize();
        });
        this.api.progress_byModule('gm2').then(res => { 
            this.loader.show(false);
            if (res.progress < 1) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm2_e2');
        let hand = new Hand(this, scale.width/2-80, scale.height/2+25);
        let board = this.add.rectangle(scale.width-88, 150, 450, 850).setName('dropzone')
            .setOrigin(1, 0).setInteractive({dropZone:true});

        this.gameplay = new Gameplay(this, {
            hand:hand, board:board
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
        this.dropzones = [];
        this.items = [];
        this.item = 0;

        // COMPONENTS
        this.hand = components.hand;
        this.board = components.board;

        this.btn_save = new Button(scene, scene.scale.width-410, scene.scale.height-150,
            {w:169, h:60, txt:'Save'}).setButton('green').setVisible(false)
            .on('pointerdown', () => { this.snapshot(); });
        this.btn_continue = new Button(scene, scene.scale.width-220, scene.scale.height-150,
            {w:190, h:60, txt:'Continue >', txtsize:'4.5em'}).setButton().setVisible(false)
            .on('pointerdown', () => {
                setTimeout(() => {
                    this.scene.loader.show();
                    this.scene.api.usersubmodule_create({
                        module_key:'gm2', submodule_key:'gm2_e2', score:500, data:{data:null}
                    }).then(res => {
                        this.scene.loader.show(false);
                        this.scene.popup.finish(`Congratulations!`, 
                        `You have completed this exercise. \n\nYou have earned ${
                        ''}[color=#275eb7]500 points[/color] for completing this exercise.`);
                    });
                }, 1000);
            });
    }

    initialize () 
    {
        let scale = this.scene.scale;
        this.scene.GM2_E2.PEOPLE.forEach((person) => {
            let container = new Item(this.scene, person);
            container.on('dragstart', () => {
                this.hand.dropzones_contents.forEach((content, i) => {
                    if (content !== null && content.name === container.name) {
                        this.hand.dropzones_contents[i] = null;
                    }
                });
            }).on('drag', (pointer, dragX, dragY) => {
                container.x = dragX;
                container.y = dragY;
            }).on('dragend', (pointer, dragX, dragY, dropped) => {
                if (!dropped) {
                    container.x = container.data.get('x');
                    container.y = container.data.get('y');
                    let flag = this.hand.dropzones_contents
                        .findIndex((content) => content !== null);
                    this.btn_save.setVisible((flag !== -1));
                    this.btn_continue.setVisible((flag !== -1));
                }
            }).on('drop', (pointer, dropZone) => {
                // container.edit_txt.setVisible((dropZone.name == 'dropzone'));
                if (dropZone.name == 'dropzone') {
                    container.x = container.data.get('x');
                    container.y = container.data.get('y');
                }
                for (let i=0; i<5; i++) {
                    let dz_content = this.hand.dropzones_contents[i];
                    if (dropZone.name == 'zone'+(i+1)) {
                        if (dz_content !== null ) {
                            container.x = container.data.get('x');
                            container.y = container.data.get('y');
                        } else {
                            this.hand.dropzones_contents[i] = container;
                            container.setPosition(this.hand.x+dropZone.x, this.hand.y+dropZone.y);
                        }
                    }
                }
                let flag = this.hand.dropzones_contents.findIndex((content) => content !== null);
                this.btn_save.setVisible((flag !== -1));
                this.btn_continue.setVisible((flag !== -1));
            });
            this.items.push(container);
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

        this.scene.game.renderer.snapshotArea(303, 111, 1055, 844, (image) => {                
            exportCanvasAsPNG(canvas, 'The Safety Hand', image.src);
        });
    }
}

class Hand extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, data={}) 
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.dropzones_contents = [null, null, null, null, null];
        this.dropzones = [
            scene.make.zone({x:-20, y:-350, width:388, height:150})
                .setName('zone1').setDropZone(),
            scene.make.zone({x:-320, y:-180, width:420, height:150})
                .setName('zone2').setDropZone(),
            scene.make.zone({x:-350, y:0, width:450, height:140})
                .setName('zone3').setDropZone(),
            scene.make.zone({x:-300, y:160, width:450, height:125})
                .setName('zone4').setDropZone(),
            scene.make.zone({x:-200, y:290, width:350, height:125})
                .setName('zone5').setDropZone()
        ];
        this.add(this.dropzones);
        // this.dropzones.forEach(zone => scene.input.enableDebug(zone));
    }
}

class Item extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setName(data.name).setDataEnabled();
        scene.add.existing(this);
        this.data.set(data);

        // CREATE - Start
        this.base = scene.add.image(0, 0, 'gm2_e2_items', data.frame);
        this.txt = scene.add.text(0, 0, data.text, { align:'center', color:'#000000',
            fontSize:'6em', fontFamily:'Font_Main', wordWrap:{width:this.base.displayWidth} })
            .setOrigin(0.5, 0.5);
        this.edit_txt = scene.add.text(this.base.displayWidth/2.3, this.base.displayHeight/2.2*-1,
            'Edit', { align:'center', color:'#000000', fontSize:'4em', fontFamily:'Font_Main',
            wordWrap:{width:this.base.displayWidth} }).setOrigin(1, 0)
            .setInteractive({useHandCursor:true}).on('pointerdown', () => {
                this.edit();
            });
        this.add([this.base, this.txt, this.edit_txt])
            .setSize(this.base.displayWidth, this.base.displayHeight)
            .setInteractive({useHandCursor:true, draggable:true});
        // CREATE - End

        // POPUP
        this.popup = new Popup(scene).window_setSize(800, 600);
        this.popup.btn_ok.setVisible(false);
        this.popup.txt.y -= 50;
        this.popup.dom_input = scene.add.dom(0, 10).createFromHTML(scene.GM2_E2.DOM_INPUT_TEXT)
            .setScale(1).setVisible(false);
        this.popup.btn_save = new Button(this.scene, 0, this.popup.height/2-150, {txt:'Save'})
            .setVisible(false).on('pointerdown', () => {
                let dom_input_main = this.popup.dom_input.getChildByID('main');
                if (dom_input_main.value !== '') {
                    this.txt.setText(dom_input_main.value);
                    dom_input_main.value = '';
                    this.popup.hide();
                }
            });
        this.popup.add([this.popup.dom_input, this.popup.btn_save]);
    }

    edit () 
    {
        this.popup.dom_input.getChildByID('main').value = this.txt.text;
        this.popup.intro.once('complete', () => {
            this.popup.dom_input.setVisible(true);
            this.popup.btn_save.setVisible(true);
        });
        this.popup.exit.once('active', () => {
            this.popup.dom_input.setVisible(false);
            this.popup.btn_save.setVisible(false);
        });
        this.popup.show('Enter Name');
    }
}
