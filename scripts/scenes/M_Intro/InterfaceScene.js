import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Menu } from "../../classes/Menu.js";

export class InterfaceScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'intro_interface'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.menu = new Menu(this).setLayout('dev').show();
        this.add.image(this.scale.width/2, this.scale.height/2, 'bg_intro_interface');
        // this.sfx_main = this.sound.add('sfx_main', {loop:true}).play();
    }

    create () 
    {
        /*** API call ***/
        this.api.progress_byModule('intro').then(res => {
            this.loader.show(false);
            if (res.progress === res.max) btn_gm.setVisible(true);
            switch (res.progress) {
                case 3: this.item3.setFinish();
                case 2: this.item2.setFinish(); this.item3.status = true;
                        this.item3.item.setFrame('item3_open');
                case 1: this.item1.setFinish(); this.item2.status = true;
                        this.item2.item.setFrame('item2_open');
                default: this.item1.status = true;
            }
        });

        let btn_gm = new Button(this, this.scale.width/2+640, this.scale.height/2+330, 
            {w:250, txt:'Go Inside >'}).setButton('main_blue').setVisible(false)
            .on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('gm_interface');
            });
        this.item1 = new Item(this, { name:'Introducing Dawn', scene:'intro_e1',
            x:this.scale.width/2-50, y:this.scale.height/2+222, item:'item1',
            bubble:'bubble1', bubbleX:-25, bubbleY:-160, checkX:55, checkY:40,
        });
        this.item2 = new Item(this, { name:'What is Domestic Violence?', scene:'intro_e2',
            x:this.scale.width/2+200, y:this.scale.height/2+180, item:'item2_locked',
            bubble:'bubble2', bubbleX:-25, bubbleY:-160, checkX:40, checkY:35,
        });
        this.item3 = new Item(this, { name:'Affirmations', scene:'intro_e3',
            x:this.scale.width/2+460, y:this.scale.height/2+210, item:'item3_locked',
            bubble:'bubble3', bubbleX:-25, bubbleY:-160, checkX:45, checkY:20,
        });

        // #00476D
        let scale = this.scale;
        let ra_logo = this.add.image(scale.width-330, 200, 'intro_interface_logo');
        let logo = this.add.image(300, 120, 'logo').setScale(0.414);
        let helpline = this.add.image(scale.width/2, scale.height-100, 'helpline').setScale(0.75);
        let text = this.add.text(540, 725, 'Click the first photo to begin your journey!',
            { align:'center', color:'#000000', fontSize:'6em', fontFamily:'Font_Main',
            lineSpacing:-30, wordWrap:{width:300} }).setOrigin(0.5, 0.5).setAngle(-8);
        let arrow = this.add.image(700, 790, 'intro_interface_arrow');
        this.tweens.add({targets:arrow, x:arrow.x-20, duration:500, yoyo:true, loop:-1});
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
        let sprite = 'intro_interface_items';
        this.status = false;
        this.item = scene.add.sprite(0, 0, sprite, data.item).setScale(0.9);
        this.bubble = scene.add.sprite(data.bubbleX, data.bubbleY, sprite, data.bubble);
        this.txt = this.scene.add.text(data.bubbleX, data.bubbleY-25, data.name, { align:'center',
            color:'#000000', fontSize:'4em', fontFamily:'Font_Main', fontStyle:'bold', 
            lineSpacing:-10, wordWrap:{width:this.bubble.width-100} }).setOrigin(0.5, 0.5);
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
                if (this.status) {
                    scene.sound.stopAll();
                    scene.scene.start(data.scene);
                }
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

    setProgress (set) 
    {
        this.progress_txt.setText(set);
    }
}
