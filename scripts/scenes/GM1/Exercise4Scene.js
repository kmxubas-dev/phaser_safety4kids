import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";

export class Exercise4Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e4'
        });
    }



    init () 
    {
        this.GM1_E4 = {
            ITEMS: [
                { name:'Talking to someone that I trust',  type:'can',  x:160, y:480, angle:4 },
                { name:'What other people do', type:'cant', x:410, y:440, angle:-4 },
                { name:'How I treat other people',  type:'can',  x:660, y:440, angle:3 },
                { name:'The choices other people make', type:'cant', x:910, y:440, angle:-3 },

                { name:'What I say and do',  type:'can',  x:160, y:745, angle:4 },
                { name:'The thoughts of other people', type:'cant', x:410, y:770, angle:0 },
                { name:'What is important to me',  type:'can',  x:660, y:720, angle:3 },
                { name:'Stopping violence by myself', type:'cant', x:910, y:720, angle:-6 }
            ]
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.popup = new Popup(this);
        this.narrator = new Narrator(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 25, 'What I Can and Can\'t Control')
            .addText2(0, 180, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 255, `I cannot control others or other things; I can only control ${
                '\n'}myself. You can’t control the actions of other people. ${
                '\n'}Other people can do hurtful things, like lying and this can ${
                '\n'}be upsetting but it is not our fault or because of anything ${
                '\n'}we have done. It is their choice how they behave. We can ${
                '\n'}just choose to be honest and respectful ourselves.`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(0, 25, 'What I Can and Can\'t Control')
                .addText2(0, 180, 'Instructions', '#3AA69D')
                .addText3(0, 240, `Dawn is about to leave the house.`)
                .addText3(0, 310, `There are some things you can control, and others ${
                    '\n'}you can’t.`)
                .addText3(0, 430, `[color=#275eb7]Drag[/color] the things you [color=#275eb7]${
                    ''}can control[/color] into Dawn’s [color=#275eb7]backpack[/color] ${
                    '\n'}so she can take them with her.`)
                .addText3(0, 550, `When you have finished, click the [color=#275eb7]Continue${
                    ''}[/color] button \nto go to the quiz.`);

            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.start();
        });
        this.api.progress_byModule('gm1').then(res => {
            this.loader.show(false);
            if (res.progress < 3) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let items = [];
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2-0.5, 'bg_gm1_e4');
        let kid = this.add.image(scale.width/2+460, scale.height/2+155, 'gm1_e4_assets', 'kid');
        let bag = this.add.image(scale.width/2+460, scale.height/2+135, 'gm1_e4_assets', 'bag');
        let bin = this.add.image(scale.width-190, scale.height-192, 'gm1_e4_assets', 'bin');
        this.GM1_E4.ITEMS.forEach((item) => {
            items.push(new Item(this, item).setName(item.type));
        });

        this.gameplay = new Gameplay(this, { 
            frame:frame, bg:bg, kid:kid, bag:bag, bin:bin, items:items
        });
        // CREATE - End

        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        }).on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.setPosition(dragX, dragY);
        }).on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        }).on('drop', (pointer, gameObject, dropZone) => {
            gameObject.setPosition(dropZone.x, dropZone.y).removeInteractive();
            gameObject.disappear.restart();
            this.gameplay.sfx_paper.play();

            if (dropZone.name === 'can') 
                this.gameplay.bag.shake.restart();
            else 
                this.gameplay.bin.shake.restart();

            if (gameObject.name === dropZone.name)
                this.gameplay.score++;
            else
                this.gameplay.incorrect++;

            if ( (this.gameplay.score+this.gameplay.incorrect) >= this.GM1_E4.ITEMS.length ) {
                this.loader.show();
                this.api.usersubmodule_create({
                    module_key:'gm1', submodule_key:'gm1_e4',
                    score:this.gameplay.score*100, data:{data:null}
                }).then(res => {
                    this.loader.show(false);
                    this.popup.finish(`Congratulations!`, `You have completed this exercise.${
                        '\n\n'}You got [color=#275eb7]${this.gameplay.score} out of ${
                        this.gameplay.items.length} answers correct[/color]. \nYou have earned ${
                        ''}[color=#275eb7]${this.gameplay.score*100} points[/color] for ${
                        ''}completing this exercise.`);
                });
            }
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
        this.score = 0;
        this.incorrect = 0;

        this.sfx_paper = this.scene.sound.add('sfx_paper_crumple');

        // COMPONENTS
        this.frame = components.frame;
        this.bg = components.bg;
        this.kid = components.kid;
        this.bag = components.bag;
        this.bin = components.bin;
        this.items = components.items;

        // DROPZONES
        this.bag.setInteractive({dropZone:true}).setName('can');
        this.bin.setInteractive({dropZone:true}).setName('cant');
        // scene.input.enableDebug();

        // TWEENS
        this.bag.shake = this.scene.tweens.add({ targets:this.bag,
            angle:{from:-5, to:5}, duration:100, repeat:5, yoyo:true
        }).pause().on('complete', () => { this.bag.setAngle(0); });
        this.bin.shake = this.scene.tweens.add({ targets:this.bin,
            angle:{from:-5, to:5}, duration:100, repeat:5, yoyo:true
        }).pause().on('complete', () => { this.bin.setAngle(0); });
    }

    start () 
    {
        
    }
}

class Item extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y).setAngle(data.angle).setDataEnabled();
        scene.add.existing(this);
        this.data.set(data);
        this.sprite = scene.add.image(0, 0, 'gm1_e4_assets', 'paper');
        this.text = scene.add.text(0, -10, data.name, { align:'center', color:'#000000',
            fontSize:'5em', fontFamily:'Font_Main', wordWrap:{width:this.sprite.displayWidth-30},
            lineSpacing:-15, stroke:'#ffffff', strokeThickness:5 }).setOrigin(0.5, 0.5);
        this.add([this.sprite, this.text])
            .setSize(this.sprite.displayWidth, this.sprite.displayHeight)
            .setInteractive({useHandCursor:true, draggable:true});
        this.disappear = scene.tweens.add({targets:this, scale:0, duration:500})
            .pause().on('complete', () => this.setVisible(false));
    }
}
