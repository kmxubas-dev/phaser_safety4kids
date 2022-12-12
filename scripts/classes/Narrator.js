// ==================================================
// NARRATOR COLLECTION
// ==================================================

import { Button } from "./Button.js";

export class Narrator extends Phaser.GameObjects.Container 
{
    constructor (scene, args={}) 
    {
        super(scene, scene.scale.width*-1, scene.scale.height/2)
            .setSize(scene.scale.width, scene.scale.height).setDepth(1);
        scene.add.existing(this);

        let w = scene.scale.width, h = scene.scale.height;
        let tw = scene.tweens;

        // CREATE - Start
        this.bg = scene.add.image(0, -0.5, 'bg_narrator').setAlpha(0).setInteractive();
        this.board = scene.add.image(0, 0, 'board').setScale(0).setVisible(true);
        this.narrator = scene.add.sprite(-650, 1080, 'characters_narrator', 'default').setScale(0.69);
        this.txts = scene.add.container(-380, -404).setVisible(false);
        this.btn = new Button(this.scene, 450, 280, {txt:'Continue >'}).setButton('main_blue')
            .on('pointerdown', () => this.hide()).setVisible(false);
        this.add([this.bg, this.board, this.narrator, this.txts, this.btn])
            .setScrollFactor(0, 0, true);
        // CREATE - End

        // TWEENS - Start
        this.intro = tw.add({targets:this, x:w/2, duration:800}).pause();
        this.exit = tw.add({targets:this, x:w*-1, duration:800}).pause();
        this.bg_intro = tw.add({targets:this.bg, alpha:1, duration:500}).pause();
        this.bg_exit = tw.add({targets:this.bg, alpha:0, duration:500}).pause();
        this.board_intro = tw.add({targets:this.board, scale:1, duration:500}).pause();
        this.board_exit = tw.add({targets:this.board, scale:0, duration:500}).pause();

        this.show_start = tw.add({ targets: this.narrator, y: 201, duration: 500 }).pause();
        this.show_2 = tw.add({ targets: this.narrator, y: 200, duration: 30 }).pause();
        this.show_3 = tw.add({ targets: this.narrator, y: 210, duration: 30 }).pause();
        this.show_final = tw.add({ targets: this.narrator, y: 250, duration: 100 }).pause();
        this.hide_start = tw.add({ targets: this.narrator, y: 210, duration: 100 }).pause();
        this.hide_2 = tw.add({ targets: this.narrator, y: 200, duration: 30 }).pause();
        this.hide_3 = tw.add({ targets: this.narrator, y: 201, duration: 30 }).pause();
        this.hide_final = tw.add({ targets: this.narrator, y: 1080, duration: 500 }).pause();
        // TWEENS - End
    }



    show (mode=false) 
    {
        this.bg.alpha = (mode) ? 1:0;
        this.bg_intro.data[0].start = (mode) ? 1:0;
        this.setX(this.scene.scale.width/2);
        this.narrator.setFrame("default");
        setTimeout(() => {
            this.bg_intro.once('complete', () => {
                this.board_intro.once('complete', () => {
                    this.txts.setVisible(true);
                    this.intro.restart();
                    this.show_start.once("complete", () => {
                        this.show_2.once("complete", () => {
                            this.show_3.once("complete", () =>
                                    this.show_final.once("complete", () => {
                                        setTimeout(() => {
                                            this.narrator.setFrame("thumbsup");
                                            this.btn.setVisible(true);
                                        }, 500);
                                    }).restart()
                                ).restart();
                        }).restart();
                    }).restart();
                }).restart();
            }).restart();
        });
        return this;
    }

    hide (mode=false) 
    {
        this.btn.setVisible(false);
        this.hide_start.once("complete", () =>
            this.hide_2.once("complete", () =>
                this.hide_3.once("complete", () => {
                    this.hide_final.restart().once('complete', () => {
                        this.txts.setVisible(false);
                        this.board_exit.once('complete', () => {
                            this.bg_exit.once('complete', () => {
                                this.exit.restart();
                            }).restart();
                        }).restart();
                    });
                }).restart()
            ).restart()
        ).restart();
        return this;
    }

    addText1 (x=0, y=0, txt='Text', color='#000000') 
    {
        let t = this.scene.add.text(x, y, txt, { color:color, wordWrap:{width:850},
            fontSize:'10em', fontFamily:'Font_Header' }).setOrigin(0, 0);
        this.txts.add(t);
        return this;
    }

    addText2 (x=0, y=0, txt='Text', color='#000000') 
    {
        let t = this.scene.add.rexBBCodeText(x, y, txt, { color:color, lineSpacing:-20, 
            fontSize:'6.33em', fontFamily:'Font_Header' }).setOrigin(0, 0);
        this.txts.add(t);
        return this;
    }

    addText3 (x=0, y=0, txt='Text', color='#000000') 
    {
        let t = this.scene.add.rexBBCodeText(x, y, txt, { color:color, lineSpacing:-20, 
            fontSize:'6.33em', fontFamily:'Font_Main' }).setOrigin(0, 0);
        this.txts.add(t);
        return this;
    }

    clearText () 
    {
        this.txts.removeAll(true);
        return this;
    }

    setText (txt_header, txt) 
    {
        this.clearText();
        this.addText1(0, 50, txt_header);
        this.addText3(0, 200, txt);
        return this;
    }

    setShow (bg=true, narrator=true, board=true) 
    {
        this.bg.setVisible(bg);
        this.narrator.setVisible(narrator);
        this.board.setVisible(board);
        return this;
    }
}
