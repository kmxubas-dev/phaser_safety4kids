// ==================================================
// VIDEO CONTROLLER CLASS
// ==================================================

import { Button } from "./Button.js";

export class Video extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2);
        scene.add.existing(this);

        data.video = data.video || 'PLACEHOLDER';
        this.args = data || {};
        this.args.w = data.w || scene.scale.width;
        this.args.h = data.h || scene.scale.height;
        this.args.type = data.type || 'dom';
        this.args.video = '/radv_phaser/assets/VIDEOS/'+data.video+'.mp4';
        this.args.title = data.title || 'Title';
        this.args.title_size = data.title_size || '6.9em';
        this.setSize(this.args.w, this.args.h);

        this.bg = scene.add.image(0, 0, 'bg_video').setScale(1.001);
        this.text = scene.add.text(0, -450, this.args.title, { align:'center', color:'#000000', 
            fontSize:this.args.title_size, fontFamily:'Font_Header', wordWrap:{width:800} })
            .setOrigin(0.5, 0.5);
        this.btn = new Button(scene, scene.scale.width/2-225, scene.scale.height/2-85,
            {txt:'Continue >'}).setButton('main_blue').setVisible(false)
            .on('pointerdown', () => {
                this.video.getChildByID('main').pause();
                this.exit.restart();
            });

        if (this.args.type === 'dom') 
            this.type_dom();
        else if (this.args.type === 'gameobject')
            this.type_gameobject();

        this.intro = this.scene.tweens.add({targets:[this], alpha:1, duration:800}).pause();
        this.exit = this.scene.tweens.add({targets:[this], alpha:0, duration:800}).pause();
    }



    show () 
    {
        this.intro.restart();
        return this;
    }

    play () 
    {
        if (this.args.type === 'dom') {
            // this.video.getChildByID('main').currentTime = 11;
            this.video.getChildByID('main').play();
        }
        else if (this.args.type === 'gameobject') 
            this.video.play(false);
        return this;
    }

    type_dom (scene=this.scene, scale=this.scene.scale) 
    {
        this.video = scene.add.dom(-10.5, 15).createFromHTML(`
            <style>video#main { outline: none; }</style>
            <video id="main" style="width:${scale.width-658}px; height:${scale.height-372.5}px;"
            controls>
                <source src="${this.args.video}" type="video/mp4">
                Your browser does not support HTML video.
            </video>`);
        this.video.getChildByID('main').addEventListener('ended', () => this.btn.setVisible(true));
        this.add([this.bg, this.text, this.btn, this.video]);
    }

    type_gameobject () 
    {
        this.video = this.scene.add.video(0, 0, 'vid_placeholder')
            .setDisplaySize(this.args.w, this.args.h);
        this.add(this.video);
    }
}
