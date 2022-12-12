import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Button } from "../../classes/Button.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { GM2_E1 as QuizData } from "../../data/QUIZ.js";

export class Exercise1Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm2_e1'
        });
    }



    init () 
    {
        this.GM2_E1 = {
            CHARACTER_MODES: [
               {name:'Normal',  frame:'default',    x:200, y:0, velocity:450, scroll:8 },
               {name:'Invisible', frame:'invisible', x:480, y:0, velocity:400, scroll:8 },
               {name:'Superhero', frame:'superhero', x:760, y:0, velocity:660, scroll:10 },
               {name:'Sneak',   frame:'sneak',      x:1040, y:0, velocity:200, scroll:5 },
               {name:'Shield',  frame:'shield',     x:1320, y:0, velocity:400, scroll:8 },
            ]
        }
    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.gameplay = new Gameplay(this);
        this.menu = new Menu(this).setLayout('dev').show();
        this.popup = new Popup(this);
    }

    create () 
    {
        // INTRO - Start
        let narrator_step = 1;
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 50, 'Superheroes and Magic')
            .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 220, `Lots of kids who are scared or unsafe at home ${
                '\n'}because one or both of their carers are behaving ${
                '\n'}in unsafe ways, tell us that they have ‘special ${
                '\n'}powers’ when it comes to staying safe.`); 
        this.narrator.btn.on('pointerdown', () => {
            if (narrator_step === 1) {
                this.narrator.clearText().addText1(0, 50, 'Superheroes and Magic')
                    .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 220, `Some kids go invisible when they need to stay safe. ${
                        '\n\n'}Some kids put up a magic shield around themselves ${
                        '\n'}and/or their siblings that protects them from ${
                        '\n'}hurtful words and yelling. ${
                        '\n\n'}Some kids can be very sneaky and quiet to stay safe.`);
            } else if (narrator_step === 2) {
                this.narrator.clearText().addText1(0, 50, 'Superheroes and Magic')
                    .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 220, `Do any stand out to you? ${
                        '\n\n'}What have you done to stay safe at home?`);
            } else {
                this.narrator.clearText().addText1(0, 50, 'Superheroes and Magic')
                    .addText2(0, 140, 'Instructions', '#3AA69D')
                    .addText3(0, 230, `Use the [color=#275eb7]Up, Down, Left and Right[/color] ${
                        ''}cursor \nkeys to make Dawn walk around the house.`)
                    .addText3(0, 360, `Click on the [color=#275eb7]buttons[/color] at the ${
                        ''}[color=#275eb7]bottom of the screen[/color] \nto activate her ${
                        ''}special powers.`)
                    .addText3(0, 490, `When you have tried all of her special powers, ${
                        '\n'}click the [color=#275eb7]Continue[/color] button for ${
                        ''}a fun challenge.`);
    
                this.narrator.btn.removeListener('pointerdown', 
                    this.narrator.btn.listeners('pointerdown')[1]);
                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            }
            narrator_step++;
        });
        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            this.gameplay.start();
        });
        // INTRO - End

        let scale = this.scale;
        this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000).setScrollFactor(0);

        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = (popup=this.popup) => {
            let score = (this.quiz.score*100)+(this.gameplay.coins_collected*50)
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'gm2', submodule_key:'gm2_e1', score:score, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                popup.finish(`Congratulations!`, `You have completed this exercise. ${
                    '\n\n'}You picked up [color=#275eb7]${this.gameplay.coins_collected} ${
                    ''}coins[/color], you got [color=#275eb7]${this.quiz.score} out of ${
                    ''}${this.quiz.data.get('items').length} answers correct[/color] ${
                    '\n'}and have earned [color=#275eb7]${score} points[/color] ${
                    ''}for completing this exercise.`);
            });
        }
    }

    update () 
    {
        this.gameplay.update();
    }
}



class Gameplay 
{
    constructor (scene) 
    {
        this.scene = scene;
        this.controls = false;
        this.buttonsClicked_count = 0;
        this.n = '';
        this.timer = new Timer();
        this.bg = this.scene.add.tileSprite(this.scene.scale.width/2, this.scene.scale.height/2,
            1920, 1094, 'gm2_e1_bg').setScrollFactor(0);

        // CHALLENGE FINISH
        this.popup = new Popup(this.scene).window_setSize(850, 550);

        this.timer_text = scene.add.text(125, 80, '00:00',
            { align:'left', color:'#000000', fontSize:'8em', fontFamily:'Font_Main',
            wordWrap:{width:1100}, stroke:'#ffffff', strokeThickness:8 })
            .setOrigin(0.5, 0.5).setScrollFactor(0).setVisible(false);
        this.btn_continue = new Button(scene, scene.scale.width-200, scene.scale.height-80, 
            {txt:'Continue >'}).setButton('main_blue').setScrollFactor(0).setVisible(false)
            .on('pointerdown', () => {
                this.controls = false;
                this.btn_continue.setVisible(false);
                this.scene.narrator.btn.btn_setText('Start', '5em');
                scene.narrator.setText(`Challenge Time!`, 
                    `See how many [color=#275eb7]gold coins[/color] you can [color=#275eb7]${
                    ''}pick up[/color] in [color=#275eb7]30 seconds[/color].${
                    '\n\n'}[color=#275eb7]Here’s a tip, some special powers make Dawn move ${
                    '\n'}faster than others[/color]. ${
                    '\n\n'}Click [color=#275eb7]Start[/color] when you are ready to try this ${
                    ''}challenge.`).show();
                scene.narrator.exit.once('complete', () => this.start2());
            });

        this.coins = this.scene.add.container(0, 0);
        this.character = new Character(scene);
        this.initialize_modes();
        scene.cameras.main.setBounds(0, 0, scene.scale.width*10, scene.scale.height);
        scene.cameras.main.startFollow(this.character)
            .on('followupdate', (camera, gameObject) => 
            { if (camera.scrollX !== 0) this.bg.tilePositionX = camera.scrollX; });
        this.character.body.setBoundsRectangle(scene.cameras.main.getBounds());
        this.character.body.setCollideWorldBounds();
    }

    start () 
    {
        this.character.setVisible(true);
        this.characterMode_btns.setVisible(true);
        this.controls = true;
    }

    start2 (scene=this.scene, scale=this.scene.scale) 
    {
        this.controls = true;
        this.buttonsClicked_count = 0;
        this.bg.tilePositionX = 0;
        this.character.setPosition(300, scene.scale.height/2);

        let coinsX = 1000, coinsY = scale.height/2;
        this.coins_collected = 0;
        this.coins.removeAll(true);
        for (let i=0; i<50; i++) {
            let coin = new Coin(scene, coinsX, coinsY).setCollect(this.character, 
                ()=>{this.coins_collected++});
            this.coins.add(coin);
            coinsX += (Math.floor(Math.random()*500)+250);
            coinsY = Math.floor(Math.random()*300)+500;
        }

        this.timer_text.setVisible(true);
        this.timer.start();
        this.timerLoop = setInterval(() => {
            this.timer_text.text = this.timer.getTime();
            if (this.timer.s === 30) {
                this.timer.stop(); clearInterval(this.timerLoop);
                this.controls = false;
                this.popup.challenge_finish(`Well Done!`, 
                    `You collected [color=#275eb7]${this.coins_collected}[/color] coins. ${
                    '\n\n'}If you want to have another go, click [color=#275eb7]Retry[/color]. ${
                    '\n\n'}Otherwise, click the [color=#275eb7]Continue[/color] button.`, 
                    {
                        retry: () => { this.start2(); },
                        continue: () => {
                            // this.popup.hide();
                            this.scene.quiz.start();
                        }
                    });
            }
        }, 1000);
        this.controls = true;
    }

    initialize_modes (scene=this.scene, scale=scene.scale) 
    {
        let button_types = ['blue', 'cyan', 'green', 'orange', 'pink'];
        this.characterMode_btns = this.scene.add.container(0, 0).setVisible(false);
        this.scene.GM2_E1.CHARACTER_MODES.forEach((mode, i) => {
            let btn = new Button(this.scene, mode.x, scale.height-80, {txt:mode.name})
                .setButton(button_types[i]).on('pointerdown', () => {
                    if (this.controls) {
                        this.character.sprite.setFrame(mode.frame+'_front0');
                        this.character.key = mode.frame;
                        this.character.velocity = mode.velocity;
                        this.character.scroll = mode.scroll;
                        if (!btn.clicked && mode.frame !== 'default') {
                            this.buttonsClicked_count++;
                            btn.clicked = true;
                        }
                        if (this.buttonsClicked_count >= 4) {
                            this.btn_continue.setVisible(true);
                        }
                        let sprite = this.character.sprite;
                        let setsize = {w:sprite.displayWidth, h:sprite.displayHeight};
                        let size_add = (mode.frame === 'sneak') ? 100:0;
                        this.character.setSize(setsize.w+size_add, setsize.h+size_add);
                        this.character.body.setSize(setsize.w+size_add, setsize.h+size_add-300,
                            false).setOffset(0, 300);
                    }
                });
            this.characterMode_btns.add(btn);
        });
        this.characterMode_btns.setScrollFactor(0, 0, true);
    }

    update () 
    {
        if (this.controls) {
            if (this.character.controls.RIGHT.isDown) {
                this.character.body.setVelocity(this.character.velocity, 0);
                this.character.sprite.play('gm2_e1_character_'+this.character.key
                    +'_walk_right', true);
            }
            else if (this.character.controls.LEFT.isDown) {
                this.character.body.setVelocity(-this.character.velocity, 0);
                this.character.sprite.play('gm2_e1_character_'+this.character.key
                    +'_walk_left', true);
            }
            else if (this.character.controls.UP.isDown) {
                if (this.character.y > 440) {
                    this.character.body.setVelocity(0, -this.character.velocity);
                    this.character.sprite.play('gm2_e1_character_'+this.character.key
                        +'_walk_up', true);
                } else {
                    this.character.sprite.setFrame(this.character.key+'_back0');
                    this.character.body.setVelocity(0);
                }
            }
            else if (this.character.controls.DOWN.isDown) {
                if (this.character.y < 800) {
                    this.character.body.setVelocity(0, this.character.velocity);
                    this.character.sprite.play('gm2_e1_character_'+this.character.key
                    +'_walk_down', true);
                } else {
                    this.character.sprite.setFrame(this.character.key+'_front0');
                    this.character.body.setVelocity(0);
                }
            }
            else {
                this.character.body.setVelocity(0);
            }
        } else {
            this.character.body.setVelocity(0);
        }
    }
}

class Character extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2+50, args={}) 
    {
        super(scene, x, y).setVisible(0);
        scene.add.existing(this);

        this.sprite = scene.add.sprite(0, 0, 'gm2_e1_character', 'default_front0')
            .setScale(0.9).setOrigin(0.5);
        this.add([this.sprite]).setSize(this.sprite.displayWidth, this.sprite.displayHeight);
        this.key = 'default';
        this.velocity = 450;
        this.scroll = 8;
        this.scene.physics.add.existing(this);
        this.controls = this.scene.input.keyboard.addKeys('UP, DOWN, LEFT, RIGHT');
        this.controls.UP.on('up', () => { this.sprite.stop().setFrame(this.key+'_back0'); });
        this.controls.DOWN.on('up', () => { this.sprite.stop().setFrame(this.key+'_front0'); });
        this.controls.LEFT.on('up', () => { this.sprite.stop().setFrame(this.key+'_left0'); });
        this.controls.RIGHT.on('up', () => { this.sprite.stop().setFrame(this.key+'_right0'); });
    }
}

class Coin extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y);
        scene.add.existing(this);
        this.sfx_coin_collect = this.scene.sound.add('sfx_coin_collect');
        this.sprite = scene.add.sprite(0, 0, 'gm2_e1_coin', 'coin').setScale(1.2);
        this.shadow = scene.add.sprite(0, 100, 'gm2_e1_coin', 'shadow').setScale(1.2);
        this.setSize(this.sprite.displayWidth, this.sprite.displayHeight)
            .add([this.sprite, this.shadow]);

        scene.tweens.add({ targets:this.sprite, y:this.sprite.y-10,
            duration:500, yoyo:true, loop:-1 });
    }

    setCollect (character, callback=()=>{}) 
    {
        this.scene.physics.add.existing(this);
        this.scene.physics.add.collider(character, this, () => {
            if (character.key !== 'shield') {
                this.body.setEnable(false);
                this.sfx_coin_collect.play();
                this.collect = this.scene.tweens.add({
                    targets:this.sprite, y:this.sprite.y-150, alpha:0, duration:250
                }).on('complete', () => this.destroy()).once('complete', callback);
            }
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
