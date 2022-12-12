import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { GM1_E1 } from "../../DATA.js";

export class Exercise1Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_e1'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.popup = new Popup(this);
        this.menu = new Menu(this).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.narrator = new Narrator(this);
        this.narrator.show(true).addText1(0, 50, 'Feelings in the Body')
            .addText2(0, 140, 'Instructions', '#3AA69D')
            .addText3(0, 230, `Do your best to [color=#275eb7]remove the objects[/color] ${
                ''}from the body \nwithout touching the edges.`)
            .addText3(0, 360, `Drag the objects into the [color=#275eb7]metal tray[/color] ${
                ''}to find out \nwhat they are.`)
            .addText3(0, 490, `When you have finished, click the [color=#275eb7]Continue[/color] ${
                ''}button \nfor a fun challenge.`);
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.start();
        });
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let items = [];
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2, 'bg_gm1_e1');
        let face = new Face(this, {x:500, y:500});
        let dish = this.add.image(scale.width/2+440, scale.height/2-330, 'gm1_e1_dish')
            .setScale(0.9).setAngle(-8);
        dish.shake = this.add.tween({ targets:[dish], angle:{from:-8, to:0},
            duration:100, repeat:1, yoyo:true }).pause();
        let txt_dish = this.add.text(scale.width/2+460, scale.height/2-380, 'Drop here',
            { align:'left', color:'#000000', fontSize:'6em', fontFamily:'Font_Main',
            wordWrap:{width:1100}, stroke:'#ffffff', strokeThickness:5 }).setOrigin(0.5, 0.5);
        let txt_score = this.add.text(115, scale.height/2-450, '000',
            { align:'left', color:'#000000', fontSize:'8em', fontFamily:'Font_Main',
            wordWrap:{width:1100}, stroke:'#ffffff', strokeThickness:5 })
            .setOrigin(0.5, 0.5);
        let txt_timer = this.add.text(115, scale.height/2-450, '00:00',
            { align:'left', color:'#000000', fontSize:'8em', fontFamily:'Font_Main',
            wordWrap:{width:1100}, stroke:'#ffffff', strokeThickness:5 })
            .setOrigin(0.5, 0.5).setVisible(false);
        let sfx_buzz = this.sound.add('sfx_buzz');

        GM1_E1.BODY_OBJECTS.forEach((item_data, i) => {
            let data = {...item_data};
            data.x = this.scale.width/2+data.x;
            data.y = this.scale.height/2+data.y;
            let item = this.add.sprite(data.x, data.y, 'gm1_e1_items', data.name).setScale(0)
                .setDataEnabled().setInteractive({
                    useHandCursor:true, draggable:true,
                    hitArea:new Phaser.Geom.Polygon(item_data.hitarea),
                    hitAreaCallback: Phaser.Geom.Polygon.Contains
                });
            item.data.set(data);
            item.data.set('currentX', item.x);
            item.data.set('currentY', item.y);
            item.data.set('hitarea_segments', []);
            for (let i=0; i<item.data.get('hitarea').length-1; i++) {
                let x1 = item.data.get('hitarea')[i].x, x2 = item.data.get('hitarea')[i+1].x;
                let y1 = item.data.get('hitarea')[i].y, y2 = item.data.get('hitarea')[i+1].y;
                var line = new Phaser.Geom.Line(item.x+x1, item.y+y1, item.x+x2, item.y+y2);
                item.data.values['hitarea_segments'].push(line);
            }
            items.push(item);
            // this.input.enableDebug(item);
        });

        this.gameplay = new Gameplay(this, {
            frame:frame, bg:bg, face:face, dish:dish, items:items,
            txt_score:txt_score, txt_timer:txt_timer,
            sfx_buzz:sfx_buzz, popup:this.popup
        });
        // CREATE - End

        // SCENE EVENTS
        this.events.on("shutdown", () => clearInterval(this.gameplay.timerLoop) );
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
        this.controls = false;
        this.step = 1;
        this.score = 0;
        this.collected = 0;
        this.timer = new Timer();

        // COMPONENTS
        this.frame = components.frame;
        this.bg = components.bg;
        this.face = components.face;
        this.dish = components.dish;
        this.items = components.items;
        this.txt_score = components.txt_score;
        this.txt_timer = components.txt_timer;
        this.popup = components.popup;
        this.sfx_buzz = components.sfx_buzz;

        // SCORE TEXT
        this.txt_score.setText(this.score);

        // DISH
        let dish_x = this.dish.displayWidth/2+25;
        let dish_y = this.dish.displayHeight/2;
        this.dish.setInteractive({ dropZone:true, useHandCursor:true,
            hitArea:new Phaser.Geom.Ellipse(dish_x, dish_y, 500, 350),
            hitAreaCallback:Phaser.Geom.Ellipse.Contains })
            .on('pointerover', () => this.dish.shake.restart());
        // this.scene.input.enableDebug(this.dish, 0xffff00);

        // ITEMS ALERT
        this.popup.items_alert = (title, text, frame) => {
            this.controls = false;
            let item = this.scene.add.sprite(0, -280, 'gm1_e1_items', frame).setScale(0.2);
            let item_bg = this.scene.add.sprite(0, -280, 'gui_shapes', 'rectangle')
                .setDisplaySize(400, 200).setAlpha(0.5).setTint(0x333333);
            this.popup.txt.setFontSize('6em').setY(this.popup.txt.y+150);
            this.popup.txt_header.setFontSize('6.9em').setY(this.popup.txt_header.y+150);
            this.popup.add([item_bg, item]);
            this.popup.show(title, text);
            this.popup.exit.once('complete', () => {
                this.controls = true;
                item.destroy();
                item_bg.destroy();
                this.popup.txt.setFontSize('6.9em').setY(this.popup.txt.y-150);
                this.popup.txt_header.setFontSize('8em').setY(this.popup.txt_header.y-150);
            });
        }

        // ITEMS
        this.items.forEach((item, i) => {
            // let graphics = this.scene.add.graphics({ add:true, x:0, y:0,
            //     lineStyle:{width:3, color:0x00FF00, alpha:1},
            //     fillStyle:{color:0xffffff, alpha:5} });
            let boundaries = [];
            let paths = GM1_E1.PATHS[i];
            for (let i=0; i<paths.length-1; i++) {
                let x1 = paths[i].x, x2 = paths[i+1].x;
                let y1 = paths[i].y, y2 = paths[i+1].y;
                var line = new Phaser.Geom.Line(x1, y1+150, x2, y2+150);
                boundaries.push(line);
                // graphics.strokeLineShape(line);
            }

            item.on('dragstart', (pointer, dragX, dragY) => {
                if (this.controls) this.scene.children.bringToTop(item);
            }).on('drag', (pointer, dragX, dragY) => {
                if (this.controls) {
                    let boundaries_contact = false;
                    item.setPosition(dragX, dragY);
                    boundaries.forEach((boundary) => {
                        item.data.get('hitarea_segments').forEach((segment, i)=>{
                            let p1 = item.data.get('hitarea')[i];
                            let p2 = item.data.get('hitarea')[i+1];
                            let scale = item.data.get('scale')+0.01;
                            segment.setTo( 
                                (dragX+p1.x*scale)-(item.displayWidth/1.88), 
                                (dragY+p1.y*scale)-(item.displayHeight/1.9), 
                                (dragX+p2.x*scale)-(item.displayWidth/1.88), 
                                (dragY+p2.y*scale)-(item.displayHeight/1.9));
                            if (Phaser.Geom.Intersects.LineToLine(boundary, segment)) {
                                boundaries_contact = true;
                            }
                        });
                    });
                    item.data.set('buzz', boundaries_contact);
                    item.data.set('currentX', item.x);
                    item.data.set('currentY', item.y);
                }
            }).on('dragend', (pointer, dragX, dragY, dropped) => {
                // this.controls = true;
            }).on('drop', (pointer, target) => {
                let fn_finish = () => {
                    if (this.collected >= 5) {
                        this.controls = false;
                        if (this.step === 1) this.start2();
                        else {
                            this.timer.stop(); clearInterval(this.timerLoop);
                            this.popup.challenge_finish(`Well Done!`, `You removed all the ${
                                ''}objects in [color=#275eb7]${this.timer.getTime(1)}[/color]. ${
                                '\n\n'}If you want to have another go, click ${
                                ''}[color=#275eb7]Retry[/color]. \n\nOtherwise, click the ${
                                ''}[color=#275eb7]Continue[/color] button.
                                `, {
                                    retry: () => { this.start2(); },
                                    continue: () => {
                                        let score_deduct = parseInt(this.timer.s)+(this.timer.m*60);
                                        let score = 1000-(score_deduct*50);
                                        this.scene.loader.show();
                                        this.scene.api.usersubmodule_create({
                                            module_key:'gm1', submodule_key:'gm1_e1',
                                            score:this.score+score, 
                                            data:{time:this.timer.getTime()}
                                        }).then(res => {
                                            this.scene.loader.show(false);
                                            this.popup.btn_retry.destroy();
                                            this.popup.finish(`Congratulations!`, 
                                            `You have completed this exercise. ${
                                            '\n\n'}You completed the challenge in [color=#275eb7]${
                                            this.timer.getTime(1)}[/color] \nand have earned ${
                                            ''}[color=#275eb7]${this.score+score} points${
                                            ''}[/color] for completing this exercise.`);
                                        });
                                    }
                                });
                        }
                    }
                }
                if (this.controls) {
                    item.setVisible(false);
                    this.dish.shake.restart();
                    this.collected++;
                    this.txt_score.setText(this.score += (this.step === 1) ? 20:0);
                    if (this.step === 1) {
                        this.popup.items_alert(
                            item.data.get('title'),
                            item.data.get('alert'),
                            item.data.get('name'));
                        this.popup.exit.once('complete', () => fn_finish());
                    } else { fn_finish(); }
                }
            });
        });

        setInterval(() => {
            let buzz = false;
            this.items.forEach((item, i) => {
                buzz = (item.data.get('buzz')) ? true:buzz;
            });
            if (buzz) {
                this.sfx_buzz.play();
                this.face.buzz();
                this.items.forEach((item, i) => {
                    if (!item.data.get('buzz')) {
                        this.scene.tweens.add({ targets:item, duration:50,
                            repeat:2, yoyo:true,
                            x:(target) => target.x + (Math.random()<0.5?-1:1)*
                                (Math.floor(Math.random()*6)),
                            y:(target) => target.y + (Math.random()<0.5?-1:1)*
                                (Math.floor(Math.random()*6)),
                        }).on('complete', (tween, targets) => {
                            targets.forEach(item => {
                                item.setPosition(item.data.get('currentX'),
                                item.data.get('currentY'));
                            });
                        });
                    }
                });
            } else this.sfx_buzz.stop();
        }, 500);

        // ITEMS TWEEN
        this.items_shake = this.scene.tweens.add({
            targets:this.items, duration:50, repeat:2, yoyo:true,
            x: { getStart:(target) => target.x +
                    (Math.random()<0.5?-1:1)*(Math.floor(Math.random()*6)),
                getEnd:(target) => target.data.get('currentX') },
            y: { getStart:(target) => target.y +
                    (Math.random()<0.5?-1:1)*(Math.floor(Math.random()*6)),
                getEnd:(target) => target.data.get('currentY') },
        }).pause().on('complete', (tween, targets) => {
            targets.forEach(item => {
                item.setPosition(item.data.get('currentX'), item.data.get('currentY'));
            });
        });
        this.items_intro = this.scene.tweens.add({
            targets:this.items, scale:(target) => target.data.get('scale'), duration:1000
        }).pause();
        this.items_exit = this.scene.tweens.add({
            targets:this.items, scale:{from:0.123, to:0}, duration:1000
        }).pause();
    }

    start () 
    {
        this.items_intro.restart();
        this.controls = true;
    }

    start2 (scene=this.scene, scale=this.scene.scale) 
    {
        this.step = 2;
        this.collected = 0;
        this.txt_timer.setVisible(true);
        this.txt_score.setVisible(false);

        this.scene.narrator.btn.btn_setText('Start', '5em');
        this.scene.narrator.exit.once('complete', () => {
            this.controls = true;
            this.timer.start();
            this.timerLoop = setInterval(() => this.txt_timer.setText(this.timer.getTime()), 1000);
            this.items.forEach((item, i) => {
                item.data.set('currentX', item.data.get('x'));
                item.data.set('currentY', item.data.get('y'));
                item.setPosition(item.data.get('x'), item.data.get('y')).setScale(0);
                item.setInteractive({useHandCursor:true, draggable:true}).setVisible(true);
            });
            setTimeout(() => { this.items_intro.restart(); }, 100);
        });
        this.scene.narrator.setText(`Challenge Time!`,
            `See how [color=#275eb7]quickly[/color] you can remove all the objects. ${
            '\n\n'}Click [color=#275eb7]Start[/color] when you are ready to ${
            ''}try this challenge.`).show();
    }
}

class Face extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}, args={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);
        this.eyes = scene.add.sprite(0, 0, 'gm1_e1_face', 'eyes');
        this.brows = scene.add.sprite(0, 0, 'gm1_e1_face', 'brows');
        this.pupils = scene.add.sprite(0, 0, 'gm1_e1_face', 'pupils');
        this.nose = scene.add.sprite(-35, -75, 'gm1_e1_face', 'nose');
        this.add([this.eyes, this.brows, this.pupils, this.nose]);
    }

    buzz () 
    {
        this.scene.add.tween({ targets:[this.brows, this.pupils],
            x:(target) => target.x + (Math.random()<0.5?-1:1)*(Math.floor(Math.random()*6)),
            y:(target) => target.y + (Math.random()<0.5?-1:1)*(Math.floor(Math.random()*6)),
            duration:50, repeat:2, yoyo:true
        }).once('start', () => {
            this.brows.setFrame('brows_buzz');
            this.pupils.setFrame('pupils_buzz');
            this.nose.setFrame('nose_buzz').setPosition(0, 0);
        }).once('complete', () => {
            this.brows.setFrame('brows').setPosition(0, 0);
            this.pupils.setFrame('pupils').setPosition(0, 0);
            this.nose.setFrame('nose').setPosition(-35, -75);
        });
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
        // Add one second so that the count down starts at the full duration
        let startTime = Date.now()+1000, timeDifference;
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
