import { Button } from "../../classes/Button.js";
import { Menu } from "../../classes/Menu.js";
import { GM1_Interface, GM2_Interface, GM3_Interface } from "../../classes/Interface.js";

export class InterfaceScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm_interface'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.add.sprite(this.scale.width/2, this.scale.height/2, 'bg_gm_interface');
        this.menu = new Menu(this).setLayout('dev').show();
    }

    create () 
    {
        // this.gm1_interface = new GM1_Interface(this);
        // this.gm2_interface = new GM2_Interface(this);
        // this.gm3_interface = new GM3_Interface(this);

        let btn_intro = new Button(this, this.scale.width/2-750, this.scale.height/2-240,
            {w:250, txt:'< Go Outside'}).setButton('main_blue').on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('intro_interface');
            });

        this.item2 = new Item(this, { name:'Safety',
            x:this.scale.width/2-245, y:this.scale.height/2+140, item:'item1',
            shadow:'item1_shadow', shadowX:-15, shadowY:69,
            bubble:'item1_bubble', bubbleX:-25, bubbleY:-160,
            progressX:65, progressY:-200, interfaceX:-69, interfaceY:-69
        });
        this.item2.interface.on('pointerdown', () => { this.gm2_interface.show(); });

        this.item1 = new Item(this, { name:'Feelings and Emotions',
            x:this.scale.width/2+25, y:this.scale.height/2+140, item:'item2',
            shadow:'item2_shadow', shadowX:-20, shadowY:90,
            bubble:'item2_bubble', bubbleX:0, bubbleY:-230,
            progressX:105, progressY:-280, interfaceX:-55, interfaceY:-130
        });
        this.item1.interface.on('pointerdown', () => { this.gm1_interface.show(); });

        this.item3 = new Item(this, { name:'Family and Relationships',
            x:this.scale.width/2+275, y:this.scale.height/2+85, item:'item3',
            shadow:'item3_shadow', shadowX:-5, shadowY:65,
            bubble:'item3_bubble', bubbleX:50, bubbleY:-180,
            progressX:180, progressY:-230, interfaceX:-80, interfaceY:-80
        });
        this.item3.txt.setY(this.item3.txt.y-8);
        this.item3.interface.on('pointerdown', () => { this.gm3_interface.show(); });

        for (let i=1; i<=3; i++) {
            this['item'+i].setProgress(parseInt((1/1)*100)+'%');
            this['item'+i].on('pointerdown', () => {
                this.scene.start('gm'+i+'_e1');
            });
        }
    }

    update () 
    {

    }
}



class Item extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}, args={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);
        let sprite = 'gm_interface_items';
        data.progress = 'progress_bubble';
        this.item = scene.add.sprite(0, 0, sprite, data.item);
        this.shadow = scene.add.sprite(data.shadowX, data.shadowY, sprite, data.shadow);
        this.bubble = scene.add.sprite(data.bubbleX, data.bubbleY, sprite, data.bubble);
        this.progress = scene.add.sprite(data.progressX, data.progressY, sprite, data.progress);
        this.txt = this.scene.add.text(data.bubbleX, data.bubbleY-25, data.name, {
            align:'center', color:'#000000', fontSize:'4em', fontFamily:'Font_Main',
            fontStyle:'bold', wordWrap:{width:this.bubble.width-100} }).setOrigin(0.5, 0.5);
        this.progress_txt = this.scene.add.text(data.progressX, data.progressY-8, '100%', {
            align:'center', color:'#ffffff', fontSize:'3em', fontFamily:'Font_Header',
            wordWrap:{width:this.bubble.width-100} }).setOrigin(0.5, 0.5);
        this.interface = this.scene.add.text(data.interfaceX, data.interfaceY, '⚙️', {
            align:'center', fontSize:'4em', fontFamily:'Font_Main'}).setOrigin(0.5, 0.5)
            .setInteractive({useHandCursor:true});

        this.pointerover = scene.add.container(0, 0).setVisible(false)
            .add([this.bubble, this.txt, this.progress, this.progress_txt]);
        this.add([this.shadow, this.item, this.pointerover, this.interface]);
        this.setSize(this.item.width, this.item.height).setInteractive({useHandCursor:true})
            .on('pointerover', () => {
                this.pointerover.setVisible(true);
                this.item.setY(this.item.y-10);
                this.shake.restart();
            }) .on('pointerout', () => {
                this.pointerover.setVisible(false);
                this.item.setY(this.item.y+10);
            });

        // TWEENS - Start
        this.shake = scene.tweens.add({ targets:[this],
            angle:2, duration:100, yoyo:true, repeat:2
        }).pause();
        // TWEENS - End
    }

    setProgress (set) 
    {
        this.progress_txt.setText(set);
    }
}
