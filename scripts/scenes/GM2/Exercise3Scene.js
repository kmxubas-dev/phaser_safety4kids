import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Video } from "../../classes/Video.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { GM2_E3 } from "../../DATA.js";

export class Exercise3Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm2_e3'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.gameplay = new Gameplay(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
        this.popup = new Popup(this).window_setSize(800, 550);
    }

    create () 
    {
        // INTRO - Start
        this.api.progress_byModule('gm2').then(res => { 
            this.loader.show(false);
            if (res.progress < 2) this.scene.start('gm_interface');
            // this.animation_video.show().play();
        });
        // INTRO - End

        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000).setScrollFactor(0);
        let bg_temp = this.add.image(scale.width/2, scale.height/2-0.5, 'bg').setScrollFactor(0);

        // this.narrator = new Narrator(this).setShow(false);
        // this.animation_video = new Video(this, {title:'What is Community?'}).setAlpha(0)
        //     .setScrollFactor(0);
        // this.animation_video.btn.setScrollFactor(0);
        // this.animation_video.exit.on('active', () => {
            bg_temp.destroy();
            this.gameplay.start();
            let narrator_step = 1;
            this.narrator = new Narrator(this);
            this.narrator.btn.removeListener('pointerdown', 
                this.narrator.btn.listeners('pointerdown')[1]);
            this.narrator.show(true).addText1(0, 50, 'Helpful Communities')
                .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                .addText3(0, 220, `A community is a group of people who have friendships ${
                    '\n'}and relationships with each other, and they come ${
                    '\n'}together because they care about each other, they ${
                    '\n'}have things in common, they do something together ${
                    '\n'}like school or sports, or because they live near ${
                    '\n'}each other.`);
            this.narrator.btn.on('pointerdown', () => {
                if (narrator_step === 1) {
                    this.narrator.clearText().addText1(0, 50, 'Helpful Communities')
                    .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                        .addText3(0, 190, `Community is important to all of us and there are ${
                            '\n'}people within your community who you can talk to and ${
                            '\n'}who can help you. Some of the people might include: ${
                            '\n\n'}•	Other members of your family that you don’t live with ${
                            '\n'}•	The people in your school ${
                            '\n'}•	Your friends, family friends and their parents ${
                            '\n'}•	Your neighbours ${
                            '\n'}•	People at your church, temple, mosque, or place ${
                            '\n'}       of worship`);
                } else {
                    this.narrator.clearText().addText1(0, 50, 'Helpful Communities')
                        .addText2(0, 140, 'Instructions', '#3AA69D')
                        .addText3(0, 220, `Use the [color=#275eb7]Up, Down, Left and Right${
                            ''}[/color] cursor keys to make ${'\n'}Dawn walk explore ${
                            ''}the community`)
                        .addText3(0, 400, `See if you can find some people to talk to ${
                            ''}along the way.`)
                        .addText3(0, 530, `Click the [color=#275eb7]Continue[/color] ${
                            ''}button to explore.`);
        
                    this.narrator.btn.removeListener('pointerdown', 
                        this.narrator.btn.listeners('pointerdown')[1]);
                    this.narrator.btn.on('pointerdown', () => this.narrator.hide());
                }
                narrator_step++;
            });
            this.narrator.exit.once('complete', () => {
                this.narrator.setShow(false);
                this.gameplay.controls = true;
            });
        // });
    }

    update () 
    {
        if (this.gameplay.character) this.gameplay.character.fn_update();
    }
}



class Gameplay 
{
    constructor (scene) 
    {
        this.scene = scene;
        this.controls = false;
        this.timer = new Timer();
        this.npcs_flag = 0;

        this.initialize_tilemap();
        this.initialize_character();
        this.initialize_npcs();
        this.timer_text = scene.add.text(50, 40, '00:00', { color:'#000000',
            fontSize:'8em', fontFamily:'Font_Main', stroke:'#FFFFFF', strokeThickness:5,
            wordWrap:{width:500}}).setOrigin(0, 0).setScrollFactor(0).setVisible(false);
        this.txt_npc = scene.add.text(50, 40, '0/8 community members visited', { color:'#000000',
            fontSize:'8em', fontFamily:'Font_Main', stroke:'#FFFFFF', strokeThickness:5,
            wordWrap:{width:800}}).setOrigin(0, 0).setScrollFactor(0).setVisible(true);
        scene.cameras.main.setBounds(-1295, -100, this.base.displayWidth, this.base.displayHeight);
        scene.cameras.main.startFollow(this.character);

        this.popup = new Popup(this.scene).window_setSize(800, 600);
        this.btn_continue = new Button(this.scene, this.scene.scale.width-200, 
            this.scene.scale.height-100, {txt:'Continue >'}).setScrollFactor(0)
            .on('pointerdown', () => { this.start2(); this.btn_continue.setVisible(false);});
            
    }

    start2 () 
    {
        this.txt_npc.setVisible(false);
        this.coins = this.scene.add.container(0, 0);
        this.coins_collected = 0;
        GM2_E3.COINS.forEach((coin) => {
            for (let i=0; i<=coin.count; i++) {
                let c = new Coin(this.scene, coin.x+(200*i*coin.xgen), coin.y+(200*i*coin.ygen))
                    .setCollect(this.character, () => {
                        this.coins_collected++;
                    });
                this.coins.add(c);
            }
        });

        this.controls = false;
        this.timer_text.setVisible(true);
        this.character.setPosition(this.scene.scale.width/2+5, this.scene.scale.height/2+80);
        this.character.sprite.setFrame('front_0');
        this.npcs.list.forEach(npc => {npc.setVisible(false); npc.body.setEnable(false);});
        this.scene.narrator.btn.btn_setText('Start', '5em');
        this.scene.narrator.setText(`Challenge Time!`,
            `See how many [color=#275eb7]gold coins[/color] you can [color=#275eb7]${
            ''}pick up[/color] in [color=#275eb7]30 seconds[/color].${
            '\n\n'}Click [color=#275eb7]Start[/color] when you are ready${
            ''} to try this challenge.`).show();
        this.scene.narrator.exit.once('complete', () => {
            this.timer.s = 0;
            this.timer.start();
            this.timerLoop = setInterval(() => {
                this.timer_text.text = this.timer.getTime();
                if (this.timer.s === 30) {
                    this.controls = false;
                    this.timer.stop(); clearInterval(this.timerLoop);
                    this.popup.challenge_finish(`Well Done!`, 
                        `You collected [color=#275eb7]${this.coins_collected}[/color] coins. ${
                        '\n\n'}If you want to have another go, click [color=#275eb7]Retry${
                        ''}[/color]. ${
                        '\n\n'}Otherwise, click the [color=#275eb7]Continue[/color] button`, {
                            retry: () => { this.start2(); },
                            continue: () => {
                                this.scene.loader.show();
                                this.scene.api.usersubmodule_create({
                                    module_key:'gm2', submodule_key:'gm2_e3', 
                                    score:100, data:{time:this.timer.getTime()}
                                }).then(res => {
                                    this.scene.loader.show(false);
                                    this.scene.popup.finish(`Congratulations!`, 
                                        `You have completed this exercise. ${
                                        '\n\n'}You picked up [color=#275eb7]${
                                        this.coins_collected} coins[/color], ${
                                        '\n'}and have earned [color=#275eb7]${
                                        this.coins_collected*50} points[/color] ${
                                        ''}for completing this exercise.`);
                                });}
                        });
                }
            }, 500);
            this.controls = true;
        });
    }
    
    start () 
    {
        this.map.setVisible(true);
        this.character.setVisible(true);
    }

    initialize_tilemap () 
    {
        let map = this.scene.make.tilemap({key: 'gm2_e3_tilemap', tileHeight:29, tileWidth:29});
        let tiles = map.addTilesetImage('E3_TILESET', 'gm2_e3_tileset');
        this.base = map.createLayer('Base', tiles, -1282, -110)
            .setVisible(true).setScale(1, 1);
        this.map = this.scene.add.container(0, 0);
        this.map.add([this.base]).setVisible(false);
        let bg = this.scene.add.image(-1280, -100, 'bg_gm2_e3').setOrigin(0, 0);
    }

    initialize_character () 
    {
        this.character = new Character(this.scene);
        this.character.fn_update = () => {
            if (this.controls) {
                let x = this.character.x;
                let y = this.character.y;
                let tile = 1;
                if (this.character.controls.RIGHT.isDown)       x += 40;
                else if (this.character.controls.LEFT.isDown)   x -= 40;
                else if (this.character.controls.UP.isDown)     y -= 50;
                else if (this.character.controls.DOWN.isDown)   y += 50;
                tile = this.base.getTileAtWorldXY(x, y, true);

                if (tile.index != -1) {
                    if (this.character.controls.RIGHT.isDown) {
                        this.character.body.setVelocity(500, 0);
                        this.character.sprite.play('gm2_e3_character_walk_right', true);
                    }
                    else if (this.character.controls.LEFT.isDown) {
                        this.character.body.setVelocity(-500, 0);
                        this.character.sprite.play('gm2_e3_character_walk_left', true);
                    }
                    else if (this.character.controls.UP.isDown) {
                        this.character.body.setVelocity(0, -500);
                        this.character.sprite.play('gm2_e3_character_walk_up', true);
                    }
                    else if (this.character.controls.DOWN.isDown) {
                        this.character.body.setVelocity(0, 500);
                        this.character.sprite.play('gm2_e3_character_walk_down', true);
                    }
                    else {
                        this.character.body.setVelocity(0);
                    }
                } else {
                    this.character.body.setVelocity(0);
                }
            } else {
                this.character.body.setVelocity(0);
            }
        }
    }

    initialize_npcs () 
    {
        this.npcs = this.scene.add.container(0, 0);
        GM2_E3.NPCS.forEach(npc_data => {
            let npc = new Npc(this.scene, npc_data);
            this.npcs.add(npc);
            this.scene.physics.add.collider(this.character, npc, () => {
                this.controls = false;
                let speech = npc_data.speech;
                npc.speech.setVisible(true);
                npc.speech.btn_close.once('pointerdown', () => {
                    this.controls = true;
                    if (this.npcs_flag >= 8) this.btn_continue.setVisible(true);
                });
                this.scene.input.once('pointerup', () => {
                    this.controls = true;
                    if (this.npcs_flag >= 8) this.btn_continue.setVisible(true);
                    npc.speech.setVisible(false);
                });

                if (!npc.flag) {
                    npc.circle.setVisible(false);
                    npc.indicator.setFrame('check');
                    npc.flag = true;
                    this.npcs_flag++;
                    this.txt_npc.setText(this.npcs_flag+'/8 community members visited');
                }
            });
        });
    }
}

class Character extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2+5, y=scene.scale.height/2+80, args={}) 
    {
        super(scene, x, y).setVisible(false);
        scene.add.existing(this);

        this.sprite = scene.add.sprite(0, 0, 'gm2_e3_character', 'down0')
            .setScale(1.1).setOrigin(0.5);
        this.add([this.sprite]).setSize(this.sprite.displayWidth, this.sprite.displayHeight);
        this.key = 'default';
        this.velocity = 300;
        this.scroll = 8;
        this.scene.physics.add.existing(this);
        this.controls = this.scene.input.keyboard.addKeys('UP, DOWN, LEFT, RIGHT');
        this.controls.UP.on('up', () => { this.sprite.stop().setFrame('up0'); });
        this.controls.DOWN.on('up', () => { this.sprite.stop().setFrame('down0'); });
        this.controls.LEFT.on('up', () => { this.sprite.stop().setFrame('left0'); });
        this.controls.RIGHT.on('up', () => { this.sprite.stop().setFrame('right0'); });
    }
}

class Npc extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, data.x, data.y);
        scene.add.existing(this);

        // CREATE - Start
        this.base = scene.add.sprite(0, 0, 'gm2_e3_npc', data.name).setScale(1.1);
        this.indicator = scene.add.image(69, -25, 'gm2_e3_assets', 'exclamation');
        this.circle = scene.add.image(0, 0, 'gm2_e3_assets', 'npc_circle').setAngle(data.angle);

        this.speech = scene.add.container(280, -150).setVisible(false);
        let speechbubble = this.scene.add.image(0, 0, 'gm2_e3_speeches', data.name);
        let speechname = this.scene.add.text(-80, -125, data.speechname, { color:'#000000',
            fontSize:'5em', fontFamily:'Font_Header', lineSpacing:0, wordWrap:{width:250} })
            .setOrigin(0, 0);
        let speechtext = this.scene.add.text(-180, -50, data.speech, { color:'#000000',
            fontSize:'4.66em', fontFamily:'Font_Main', lineSpacing:-20, wordWrap:{width:375} })
            .setOrigin(0, 0);
        this.speech.btn_close = new Button(this.scene, 220, -150, { w:60, h:60, txt:' ',
            texture:'gm2_e3_buttons' }).setButton('close').setName('btn_close')
            .on('pointerdown', () => { this.speech.setVisible(false); });
        this.speech.add([speechbubble, speechname, speechtext, this.speech.btn_close]);

        this.add([this.circle, this.base, this.indicator, this.speech])
            .setSize(this.base.displayWidth, this.base.displayHeight);
        // CREATE - End

        this.scene.physics.add.existing(this);
        this.body.setImmovable();
    }
}

class Coin extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.sfx_coin_collect = this.scene.sound.add('sfx_coin_collect');
        this.sprite = scene.add.sprite(0, 0, 'gm2_e1_coin', 'coin');
        this.add([this.sprite]).setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    }

    setCollect (character, callback=()=>{}) 
    {
        this.scene.physics.add.existing(this);
        this.scene.physics.add.collider(character, this, () => {
            this.body.setEnable(false);
            this.sfx_coin_collect.play();
            this.collect = this.scene.tweens.add({
                targets:[this], x:character.x, y:character.y, duration:250
            }).on('complete', () => this.destroy()).once('complete', callback);
        });
        return this;
    }
}

class Timer 
{
    constructor () 
    {
        this.loop = 0;
        this.h = 0, this.m = 0, this.s = 0;
        this.time = { hours: 0, minutes: 0, seconds: 0 }
    }

    getTime (format=0) 
    {
        if (format === 0) {
            return this.m+':'+this.s;
        } else {
            let item = (parseInt(this.m) > 0) ? parseInt(this.m)+' minutes ':'';
            item += (parseInt(this.m) > 0 && parseInt(this.s) > 0) ? 'and ':'';
            return item += (parseInt(this.s) > 0) ? parseInt(this.s)+' seconds ':'';
        }
    }

    start (count='up', duration=1000) 
    {
        this.stop();
        // add one second so that the count down starts at the full duration
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
