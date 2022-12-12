import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Menu } from "../../classes/Menu.js";
import { ProgressCircle } from "../../classes/Progress.js";

export class CompletionScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'intro_completion'
        });
    }



    init () 
    {
        let scale = this.scale;
        this.text_data = [
            { text:'Congratulations!', x:scale.width/2, y:scale.height/2-310,
                font:'Font_Header', size:'10em' },
            { text:`You have completed the Introduction Module. \nYou are ready to ${
                ''}explore the rest of the course.`, x:scale.width/2, y:scale.height/2-180,
                font:'Font_Main', size:'6.9em' },
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
        this.api.progress_byModule('intro').then(res => {
            if (res.progress !== res.max) this.scene.start('intro_interface');
            this.loader.show(false);
            setTimeout(() => {
                res.score = 'Module Score: '+res.score;
                this.add.text(this.scale.width/2-255, this.scale.height/2+20, res.score, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
            }, 1000);
        });
        this.api.progress_overall().then(res => {
            this.loader.show(false);
            // this.progress.drawProgress(res.max, res.progress);
            setTimeout(() => {
                let txt_progress = 'Course progress: '+parseInt((res.progress/res.max)*100)+'%';
                this.add.text(this.scale.width/2-255, this.scale.height/2-60, txt_progress, {
                    align:'left', color:'#275EB7', fontSize:'7em', fontFamily:'Font_Main',
                    wordWrap:{width:800} }).setOrigin(0, 0.5);
                
                let txt_score = 'Total Score: '+res.score;
                this.add.text(this.scale.width/2-255, this.scale.height/2+100, txt_score, {
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
            this.add.rexBBCodeText(text.x, text.y, text.text, { align:'center', color:'#000000', 
                fontSize:text.size, fontFamily:text.font, lineSpacing:-20, 
                wordWrap:{width:880} }).setOrigin(0.5, 0.5);
        });
        // this.progress = new ProgressCircle(this, this.scale.width/2, this.scale.height/2+110)
        //     .setArgs({radius:60, base_w:30, progress_w:20, fontSize:'3.3em'});

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
