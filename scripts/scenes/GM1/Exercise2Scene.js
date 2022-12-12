import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { ASSETS } from "../../ENV.js";

export class Exercise2Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e2'
        });
    }



    init () 
    {
        this.GM1_E2 = {
            BALLOONS: [
                { frame:'b1', x:this.scale.width/2-725, y:300, name:'Worry 1' },
                { frame:'b2', x:this.scale.width/2-450, y:360, name:'Worry 2' },
                { frame:'b3', x:this.scale.width/2-150, y:280, name:'Worry 3' },
                { frame:'b4', x:this.scale.width/2+150, y:370, name:'Worry 4' },
                { frame:'b5', x:this.scale.width/2+450, y:300, name:'Worry 5' },
                { frame:'b6', x:this.scale.width/2+725, y:360, name:'Worry 6' },
            ]
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.menu = new Menu(this).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 35, 'My Worries')
            .addText2(0, 120, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 200, `Some days we feel great, we have fun, and it seems like ${
                '\n'}the sun is shining. Other days can be tough, we might not ${
                '\n'}feel great, it’s not fun and we might not feel friendly. ${
                '\n'}On these days the clouds are hiding the sunshine. ${
                '\n'}Worries are like clouds, and they ${
                '\n'}can make us feel gloomy.`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(0, 35, 'My Worries')
                .addText2(0, 120, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                .addText3(0, 200, `We all worry sometimes, worry is normal. Sometimes we ${
                    '\n'}have little worries and sometimes we have big worries. ${
                    '\n'}Worry helps us to predict what might happen next ${
                    '\n'}and often this help us feel safe in a situation. ${
                    '\n\n'} Why is that worry so big? ${
                    '\n'}What could make it smaller? ${
                    '\n'}Are there times they have been smaller? ${
                    '\n'}Who can I talk to about this worry?`);

            this.narrator.btn.once('pointerdown', () => {
                this.narrator.clearText().addText1(0, 35, 'My Worries')
                    .addText2(0, 120, 'Instructions', '#3AA69D')
                    .addText3(0, 200, `Talk about the worries on the balloons ${
                        ''}with your counsellor.`)
                    .addText3(0, 280, `The worries that are [color=#275eb7]more important${
                        ''}[/color] to you, click and hold \nthem to [color=#275eb7]${
                        ''}make them bigger[/color].`)
                    .addText3(0, 410, `The worries that are [color=#275eb7]less important${
                        ''}[/color] to you, click and hold \non the spout to [color=#275eb7]${
                        ''}make them smaller[/color].`)
                    .addText3(0, 540, `When you have finished, click the [color=#275eb7]${
                        ''}Continue[/color] button for a \nfun challenge.`);

                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            });
        });
        
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.start();
        });
        this.api.progress_byModule('gm1').then(res => { 
            this.loader.show(false);
            if (res.progress < 1) this.scene.start('gm_interface');
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2, 'bg_gm1_e2').setScale(1.01);
        let txt_timer = this.add.text(110, 69, '00:00', { align:'left', color:'#000000',
            fontSize:'6em', fontFamily:'Font_Main', wordWrap:{width:300}, stroke:'#ffffff',
            strokeThickness:5 }).setOrigin(0.5, 0.5).setVisible(false);
        let btn_start = new Button(this, scale.width-200, scale.height-100,
            {txt:'Start'}).setButton().setVisible(false);

        this.gameplay = new Gameplay(this, {
            frame:frame, bg:bg, txt_timer:txt_timer, btn_start:btn_start
        });
        // CREATE - End

        this.input.on('pointerup', () => {
            this.gameplay.balloons.forEach((balloon) => {
                balloon.inflate = false;
                balloon.deflate = false;
            });
        });

        // SCENE EVENTS
        this.events.on("shutdown", () => {
            clearInterval(this.gameplay.timerLoop);
            this.input.setDefaultCursor('auto');
        });
    }

    update () 
    {
        this.gameplay.balloons.forEach((balloon) => {
            if (balloon.inflate && balloon.scaleX < 1.5)
                balloon.setScale(balloon.scaleX+0.01, balloon.scaleY+0.01);
            if (balloon.deflate && balloon.scaleX > 0.5)
                balloon.setScale(balloon.scaleX-0.01, balloon.scaleY-0.01);
        });
    }
}



class Gameplay 
{
    constructor (scene , components={}) 
    {
        this.scene = scene;
        this.balloons = [];
        this.popped = 0;
        this.timer = new Timer();

        // COMPONENTS
        this.frame = components.frame;
        this.bg = components.bg;
        this.txt_timer = components.txt_timer;
        this.btn_start = components.btn_start;

        this.btn_start.on('pointerdown', () => {
            this.btn_start.setVisible(false);
            this.start2();
        });

        this.popup = new Popup(this.scene).window_setSize(1100, 800);
    }

    start (scene=this.scene, scale=this.scene.scale) 
    {
        this.popped = 0;
        this.txt_timer.setText('00:00');
        this.balloons.splice(0, this.balloons.length);
        this.btn_start.setVisible(true);
        this.scene.input.setDefaultCursor('auto');
        this.scene.GM1_E2.BALLOONS.forEach((balloon) => {
            let container = new Balloon(scene, balloon);
            this.balloons.push(container);
        });
    }

    start2 () 
    {
        this.scene.narrator.btn.btn_setText('Start', '5em');
        this.scene.narrator.exit.once('complete', () => {
            this.txt_timer.setVisible(true);
            this.scene.input.setDefaultCursor('url('+ASSETS.CURSORS.NEEDLE+'), pointer');
            this.balloons.forEach((balloon) => {
                balloon.setVisible(true);
                balloon.spout.input.cursor = 'url('+ASSETS.CURSORS.NEEDLE+'), pointer';
                balloon.sprite.input.cursor = 'url('+ASSETS.CURSORS.NEEDLE+'), pointer';
                balloon.spout.removeAllListeners();
                balloon.sprite.removeAllListeners().once('pointerdown', () => {
                    balloon.pop();
                    this.popped++;
                    if (this.popped === this.balloons.length) {
                        this.timer.stop(); clearInterval(this.timerLoop);

                        this.scene.input.setDefaultCursor('auto');
                        this.popup.challenge_finish(`Well Done!`, 
                            `You popped all your worries in [color=#275eb7]${
                            this.timer.getTime(1)}[/color]. \n\nIf you want to have another go, ${
                            ''}click [color=#275eb7]Retry[/color]. \n\nOtherwise, click ${
                            ''}the [color=#275eb7]Continue[/color] button.`, 
                            {
                                retry: () => { setTimeout(()=> this.start(), 800) },
                                continue: () => {
                                    let score_deduct = parseInt(this.timer.s)+(this.timer.m*60);
                                    let score = 1000-(score_deduct*50);
                                    this.scene.loader.show();
                                    this.scene.api.usersubmodule_create({
                                        module_key:'gm1', submodule_key:'gm1_e2',
                                        score:score, data:{time:this.timer.getTime()}
                                    }).then(res => {
                                        this.scene.loader.show(false);
                                        this.popup.btn_retry.setVisible(false);
                                        this.popup.finish(`Congratulations!`, 
                                        `You have completed this exercise. ${
                                        '\n\n'}You completed the challenge in [color=#275eb7]${
                                        this.timer.getTime(1)}[/color] \nand have earned ${
                                        ''}[color=#275eb7]${score} points[/color] for completing ${
                                        ''}this exercise.`);
                                    });
                                }
                            } );
                    }
                });
            });

            this.timer.start();
            this.timerLoop = setInterval(() => {
                this.txt_timer.setText(this.timer.getTime());
            }, 1000);
        });
        this.scene.narrator.setText(`Challenge Time!`,
            `See how [color=#275eb7]quickly[/color] you can ${
            ''}[color=#275eb7]pop all the balloons[/color]. ${
            '\n\n'}Click [color=#275eb7]Start[/color] when you ${
            ''}are ready to try this challenge.`).show(true);
    }
}

class Balloon extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}, args={}) 
    {
        super(scene, data.x, data.y).setDataEnabled();
        scene.add.existing(this);

        this.data.set(data);
        this.sfx_pop = this.scene.sound.add('sfx_pop_sm');
        this.sprite = scene.add.sprite(0, 0, 'gm1_e2_balloons', data.frame).setScale(0.69)
            .setInteractive({useHandCursor:true}).on('pointerup', () =>  this.inflate = false)
            .on('pointerdown', () => {
                if (this.scaleX < 1.5) {
                    this.inflate = true;
                    this.setScale(this.scaleX+0.01, this.scaleY+0.01);
                }
            });
        this.spout = scene.add.zone(0, 90, 45, 45).setInteractive({useHandCursor:true})
            .on('pointerup', () => { this.deflate = false; }).on('pointerdown', () => {
                if (this.scaleX > 0.5) {
                    this.deflate = true;
                    this.setScale(this.scaleX-0.01, this.scaleY-0.01);
                }
            });
        this.text = scene.add.text(0, -25, data.name, { align:'left', color:'#000000',
            fontSize:'5em', fontFamily:'Font_Main', stroke:'#ffffff', strokeThickness:5,
            wordWrap:{width:300} }).setOrigin(0.5, 0.5);

        this.add([this.sprite, this.spout])
            .setSize(this.sprite.displayWidth, this.sprite.displayHeight);
        this.scene.tweens.add({targets:this, y:data.y-15, duration:1000, loop:-1, yoyo:true});
    }

    pop () 
    {
        this.sfx_pop.play();
        this.sprite.play('gm1_e2_balloons_'+this.data.get('frame')+'_pop', true);
        setTimeout(() => this.destroy(), 500);
    }
}

class Timer 
{
    constructor () 
    {
        this.loop = 0;
        this.h = 0, this.m = 0, this.s = 0;
    }

    getTime (format=0) 
    {
        if (format === 0) {
            return this.m+':'+this.s;
        } else {
            let time = (parseInt(this.m) > 0) ? parseInt(this.m)+' minutes ':'';
            time += (parseInt(this.m) > 0 && parseInt(this.s) > 0) ? 'and ':'';
            return time += (parseInt(this.s) > 0) ? parseInt(this.s)+' seconds ':'';
        }
    }

    start (count='up', duration=1000) 
    {
        this.stop();
        // add one second so that the count down starts at the full duration
        let startTime = Date.now(), timeDifference;
        this.loop = setInterval(() => {
            // Time difference between duration and the time that timer started
            timeDifference = (((Date.now() - startTime) / 1000) | 0);
            if (count !== 'up') {
                timeDifference = duration - timeDifference;
                if (timeDifference <= 0) this.stop();
            }
            // Does the same job as parseInt truncates the float
            this.m = (timeDifference / 60) | 0;
            this.s = (timeDifference % 60) | 0;
            this.m = (this.m < 10) ? '0'+this.m : this.m;
            this.s = (this.s < 10) ? '0'+this.s : this.s;
        }, 1000);
    }

    stop () 
    {
        clearInterval(this.loop);
    }
}
