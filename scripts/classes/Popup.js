// ==================================================
// POPUP COLLECTION
// ==================================================

import { API } from "./API.js";
import { Button } from "./Button.js";

export class Popup extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y).setScale(0).setDepth(1);
        scene.add.existing(this);

        this.api = new API();
        this.bg = scene.add.image(0, -0.5, 'bg_popup').setAlpha(0).setVisible(false);
        this.window = scene.add.image(-10, 10, 'board');
        this.txt_header = scene.add.text(0, -350, 'Text Header', { align:'center', color:'#000', 
            fontSize:'8em', fontFamily:'Font_Header', wordWrap:{width:850} }).setOrigin(0.5, 0);
        this.txt = this.scene.add.rexBBCodeText(0, 0, 'Text', { align:'center', color:'#000', 
            fontSize:'6.9em', fontFamily:'Font_Main', lineSpacing:-20, wordWrap:{width:850}, 
            stroke:'#ffffff', strokeThickness:5
        }).setOrigin(0.5, 0);

        this.btn_ok = new Button(this.scene, 0, 150, {w:180, h:100, txt:'OK'})
            .setButton('main_blue').on('pointerdown', () => this.hide()).setVisible(true);
        this.confirm_yes = new Button(this.scene, -150, 150, {txt:'Yes'}).setVisible(false);
        this.confirm_no = new Button(this.scene, 150, 150, {txt:'No'}).setVisible(false);
        this.window_setSize().add([ this.bg, this.window, this.txt_header, this.txt,
            this.btn_ok, this.confirm_yes, this.confirm_no
        ]).setInteractive().setScrollFactor(0, 0, true);

        // TWEENS - Start
        this.bg_intro = scene.tweens.add({targets:this.bg, alpha:1, duration:500}).pause();
        this.bg_exit = scene.tweens.add({targets:this.bg, alpha:0, duration:500}).pause();
        this.intro = scene.tweens.add({targets:this, scale:1, duration:500}).pause();
        this.exit = scene.tweens.add({targets:this, scale:0, duration:500}).pause();
        // TWEENS - End
    }



    show (txt_header='', txt='') 
    {
        this.txt_header.setText(txt_header);
        this.txt.setText(txt);
        this.intro.once('active', () => this.scene.children.bringToTop(this))
            .once('complete', () => {if (this.bg.visible) this.bg_intro.restart();}).restart();
        this.scene.children.bringToTop(this);
        this.scene.add.container(0, 0).destroy();
    }

    hide () 
    {
        this.bg_exit.once('active', () => {if (!this.bg.visible) this.exit.restart();})
            .once('complete', () => {if (this.bg.visible) this.exit.restart();}).restart();
    }

    window_setSize (w=1300, h=825) 
    {
        this.window.setDisplaySize(w+(w*0.5), h+(h*0.3));
        this.btn_ok.setPosition(0, (h/2)-125);
        this.txt_header.setPosition(0, h*-0.35);
        this.txt.setPosition(0, this.txt_header.y+80);
        this.txt.setWordWrapWidth(w-(w*0.15));
        this.setSize(w, h);
        return this;
    }

    setBG (set=true) 
    {
        this.bg.setVisible(set);
        return this;
    }

    confirm (text='', args={}) 
    {
        let callback_active = (tween, targets) => {}
        let callback_complete = (tween, targets) => {}
        this.args = args || {};
        this.args.callback_active = args.callback_active || callback_active;
        this.args.callback_complete = args.callback_complete || callback_complete;

        this.confirm_answer = false;
        this.intro.once('active', () => {
            this.btn_ok.setVisible(false);
            this.confirm_yes.setVisible(true);
            this.confirm_no.setVisible(true);
        });
        this.exit.once('complete', () => {
            this.btn_ok.setVisible(true);
            this.confirm_yes.setVisible(false);
            this.confirm_no.setVisible(false);
        }).once('active', this.args.callback_active)
        .once('complete', this.args.callback_complete);
        this.confirm_yes.once('pointerdown', () => {
            this.confirm_answer = true;
            this.exit.restart();
        });
        this.confirm_no.once('pointerdown', () => {
            this.confirm_answer = false;
            this.exit.restart();
        });
        this.txt_header.setText('');
        this.txt.setText(text);
        this.intro.once('active', () => this.scene.children.bringToTop(this)).restart();
    }

    finish (txt_header='', txt='', module='gm', scene_key='default') 
    {
        let scene = this.scene;
        if (module === 'gm') {
            this.score_text = scene.add.rexBBCodeText(0, 150, '', { align:'center', 
                color:'#000000', fontSize:'6.9em', fontFamily:'Font_Main', fontStyle:'bold', 
                wordWrap:{width:800} }).setOrigin(0.5, 0.5);
            this.continue_txt = scene.add.rexBBCodeText(0, 210, `Click the ${
                ''}[color=#275eb7]Continue[/color] button to go to the next exercise.`,
                { align:'center', color:'#000000', fontSize:'5em', fontFamily:'Font_Main', 
                fontStyle:'bold', wordWrap:{width:800} }).setOrigin(0.5, 0.5);
            this.add([this.score_text, this.continue_txt]);
            this.api.progress_overall().then(res => this.score_text.setText(
                `[b]Your current score is [color=#275eb7]${res.score}[/color][/b]`));
        }

        if (scene_key === 'default') {
            let scene_next = scene.scene.manager.scenes[scene.scene.getIndex(scene.key)+1];
            this.btn_ok.once('pointerdown', () => scene.scene.start(scene_next));
        } else {
            this.btn_ok.once('pointerdown', () => scene.scene.start(scene_key));
        }

        this.setBG().window_setSize();
        this.txt_header.setY(-345).setFontSize('10em').setText(txt_header);
        this.txt.setY(-240).setText(txt);
        this.btn_ok.setPosition(this.window.displayWidth/2-525, this.window.displayHeight/2-250)
            .btn_setSize().btn_setText('Continue >');
        if (this.scale === 0) this.show(txt_header, txt);
        else scene.tweens.add({targets:this.bg, alpha:1, duration:500});
    }

    challenge_finish (txt_header, txt, fns={}) 
    {
        let btn_ok = this.btn_ok;
        let callback_retry = () => {}
        let callback_continue = () => {}
        fns.retry = fns.retry || callback_retry;
        fns.continue = fns.continue || callback_continue;

        this.window_setSize(1200, 880);
        this.txt_header.setFontSize('10em');
        this.btn_retry = new Button(this.scene, -200, this.btn_ok.y-50, {txt:'< Retry'})
            .setButton('main_purple').on('pointerdown', () => this.hide())
            .once('pointerdown', fns.retry);
        this.add(this.btn_retry).setScrollFactor(0, 0, true);
        btn_ok.removeListener('pointerdown', btn_ok.listeners('pointerdown')[1]);
        btn_ok.btn_setSize().btn_setText('Continue >').once('pointerdown', fns.continue);
        btn_ok.setPosition(btn_ok.x+200, btn_ok.y-50);

        this.show(txt_header, txt);
        this.exit.once('complete', () => {
            let btn_ok_events = btn_ok.listeners('pointerdown')[1];
            btn_ok.removeListener('pointerdown', btn_ok.listeners('pointerdown')[1]);
            btn_ok.btn_setSize(180, 100).btn_setText('OK').once('pointerdown', btn_ok_events);
            btn_ok.setPosition(btn_ok.x-200, btn_ok.y+50);
            this.txt_header.setFontSize('8em');
            this.btn_retry.destroy();
        });
    }
}
