// ==================================================
// MENU CLASS
// ==================================================

// import { API } from "./API.js";
import { Loader } from "./Loader.js";
import { Button } from "./Button.js";
import { Leaderboard } from "./Leaderboard.js";

export class Menu 
{
    constructor (scene, args={}) 
    {
        this.scene = scene;

        this.args = args || {};
        this.args.midX = scene.scale.width/2;
        this.args.midY = scene.scale.height/2;
        this.args.btnX = args.btnX || scene.scale.width-110;
        this.args.btnY = args.btnY || 80;

        // this.api = new API();
        this.loader = new Loader(scene);
        // this.leaderboard = new Leaderboard(scene, {type:'overall'});
        this.btn = new Button(this.scene, this.args.btnX, this.args.btnY, { w:80, h:60,
            txt:' ', texture:'btns_menu' }).setButton('menu').setVisible(false).setDepth(100)
            .setScrollFactor(0).on('pointerdown', () => { this.window.intro.restart(); });
        this.window = scene.add.container(this.args.midX, this.args.midY).setScale(0).setDepth(100)
            .setSize(scene.scale.width, scene.scale.height).setInteractive()
            .setScrollFactor(0, 0, true);
        this.window.intro = scene.tweens.add({targets:this.window, scale:1, duration:500})
            .pause().on('complete', () => { this.scene.children.bringToTop(this.window); });
        this.window.exit = scene.tweens.add({targets:this.window, scale:0, duration:500})
            .pause().on('complete', () => { });
    }

    show (show=true) 
    {
        this.btn.setVisible(show);
        return this;
    }

    setLayout (layout=null) 
    {
        if (layout === null) {
            this.layout_null();
        }
        else if (layout === 'intro') {
            this.layout_introduction();
        }
        else if (layout === 'game') {

        }
        else if (layout === 'dev') {
            this.layout_dev();
        }
        return this;
    }

    layout_null () 
    {
        let scene_previous = this.scene.scene.manager
            .scenes[this.scene.scene.getIndex(this.scene.key)-1];
        let scene_next = this.scene.scene.manager
            .scenes[this.scene.scene.getIndex(this.scene.key)+1];

        this.scene.input.keyboard.on('keydown-ESC', (event) => {
            this.scene.sound.stopByKey('sfx_main');
            this.scene.scene.start('dev');
        });
        this.scene.input.keyboard.on('keydown-ONE', (event) => {
            this.scene.sound.stopByKey('sfx_main');
            this.scene.scene.start('gm_interface');
        });
        this.scene.input.keyboard.on('keydown-TWO', (event) => {
            this.scene.scene.start(scene_previous.scene.key);
        });
        this.scene.input.keyboard.on('keydown-THREE', (event) => {
            this.scene.scene.start(scene_next.scene.key);
        });
        return this;
    }

    layout_introduction () 
    {
        //
    }
    
    layout_game () 
    {
        //
    }

    layout_dev (scene=this.scene, scale=this.scene.scale) 
    {
        let dom = this.scene.add.dom(0, 0).createFromCache('dom_menu').setDepth(10);
        this.window.add(dom);
        let scene_previous = this.scene.scene.manager
            .scenes[this.scene.scene.getIndex(this.scene.key)-1];
        let scene_next = this.scene.scene.manager
            .scenes[this.scene.scene.getIndex(this.scene.key)+1];

        dom.getChildByID('btn_close').addEventListener('click', () => {
            this.window.exit.restart();
        });
        dom.getChildByID('btn_gm').addEventListener('click', () => {
            scene.scene.start('gm_interface');
        });
        dom.getChildByID('btn_dev').addEventListener('click', () => {
            scene.scene.start('dev');
        });
        dom.getChildByID('btn_mute').addEventListener('click', () => {
            this.scene.sound.setMute(true);
        });
        dom.getChildByID('btn_unmute').addEventListener('click', () => {
            this.scene.sound.setMute(false);
        });
        dom.getChildByID('btn_previous').addEventListener('click', () => {
            this.scene.scene.start(scene_previous.scene.key);
        });
        dom.getChildByID('btn_next').addEventListener('click', () => {
            this.scene.scene.start(scene_next.scene.key);
        });
        dom.getChildByID('btn_leaderboard').addEventListener('click', () => {
            this.leaderboard.show();
        });
        dom.getChildByID('btn_logout').addEventListener('click', () => {
            this.window.exit.restart();
            this.loader.show();
            // this.api.logout().then((res) => {
            //     this.loader.show(false);
            //     if (res.status === 204)
            //         setTimeout(() => scene.scene.start('auth_login'), 900);
            // });
        });
        return this;
    }
}
