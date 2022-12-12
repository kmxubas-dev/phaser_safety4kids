import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Menu } from "../../classes/Menu.js";

export class CompletionScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm_completion'
        });
    }



    init () 
    {
        let scale = this.scale;
        this.text_data = [
            { text:'Congratulations!', x:scale.width/2, y:scale.height/2-320,
                font:'Font_Header', size:'10em' },
            { text:'You have completed the [color=#275EB7]course[/color]!', 
                x:scale.width/2, y:scale.height/2-220, font:'Font_Main', size:'7.5em' },
            { text:`Click the [color=#275EB7]Go Home[/color] button to return to the ${
                ''}module selection screen.`, x:scale.width/2, y:scale.height/2+200, 
                font:'Font_Main', size:'5.5em' },
        ];
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        this.api.progress_overall().then(res => {
            if (res.progress !== res.max) this.scene.start('gm_interface'); });

        this.api.progress_byModule('gm1').then(res => {
            this.loader.show(false);
            setTimeout(() => {
                res.score = 'Feelings and Emotions Module Score: '+res.score;
                this.add.text(this.scale.width/2-360, this.scale.height/2-125, res.score, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
            }, 1000);
        });
        this.api.progress_byModule('gm2').then(res => {
            this.loader.show(false);
            setTimeout(() => {
                res.score = 'Safety Module Score: '+res.score;
                this.add.text(this.scale.width/2-360, this.scale.height/2-50, res.score, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
            }, 1000);
        });
        this.api.progress_byModule('gm3').then(res => {
            this.loader.show(false);
            setTimeout(() => {
                res.score = 'Family and Relationships Module Score: '+res.score;
                this.add.text(this.scale.width/2-360, this.scale.height/2+25, res.score, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
            }, 1000);
        });
        this.api.progress_overall().then(res => {
            this.loader.show(false);
            setTimeout(() => {
                res.score = 'Total Score: '+res.score;
                this.add.text(this.scale.width/2-360, this.scale.height/2+100, res.score, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
            }, 1000);
        });

        // CREATE - Start
        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'bg');
        this.add.image(scale.width/2, scale.height/2, 'board');
        this.sfx_completion = this.sound.add('sfx_completion');
        this.sfx_main = this.sound.add('sfx_main', {loop:true});
        // CREATE - End

        this.text_data.forEach((text) => {
            this.add.rexBBCodeText(text.x, text.y, text.text, { color:'#000000', 
                fontSize:text.size, fontFamily:text.font, lineSpacing:-20, 
                wordWrap:{width:880} }).setOrigin(0.5, 0.5);
        });

        let btn_home = new Button(this, scale.width/2, scale.height/2+290, {w:280, h:80,
            txt:'Go Home'}).setButton().on('pointerdown', () => {
                this.tweens.add({targets:[this.sfx_completion], volume:0, duration:1000})
                    .on('complete', (tweens, targets) => {
                        this.sound.stopAll();
                        this.scene.start('gm_interface');
                    });
            });
    }

    update () 
    {

    }
}
