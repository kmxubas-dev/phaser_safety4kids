// ==================================================
// INTERFACE CLASS
// ==================================================

import { API } from "./API.js";
import { Leaderboard } from "./Leaderboard.js";

class Submodules_Interface extends Phaser.GameObjects.Container 
{
    constructor (scene, args={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2).setScale(0)
            .setSize(scene.scale.width, scene.scale.height).setInteractive();
        scene.add.existing(this);

        this.api = new API;
        this.leaderboard = new Leaderboard(scene, {type:'module'});
        this.args = args || {};
        this.module = args.module || 'gm1';
        this.submodules = args.submodules || [];

        this.intro = scene.tweens.add({targets:[this], scale:1, duration:500}).pause()
            .on('complete', () => { this.scene.children.bringToTop(this); });
        this.exit = scene.tweens.add({targets:[this], scale:0, duration:500}).pause()
            .on('complete', () => { });
        this.initialize();
        this.eventListeners();
    }

    initialize () 
    {
        this.dom = this.scene.add.dom(0, 0).createFromCache('dom_'+this.module+'_interface')
            .setOrigin(0.5).setDepth(10);
        this.add(this.dom).setScrollFactor(0, 0, true);

        this.api.progress_status_byModule(this.module).then(res => {
            this.submodules.forEach((subname, i) => {
                let subdata = res.find(resdata => {
                    return resdata.submodule_key === this.module+'_'+subname
                });
                if (res.length >= i) {
                    this.dom.getChildByID(subname+'_btn').disabled = false;
                    this.dom.getChildByID(subname+'_locked').classList.add('hidden');
                    this.dom.getChildByID(subname+'_playable').classList.remove('hidden');
                }
                if (subdata !== undefined) {
                    let timestamp = this.getElapseTime(subdata.updated_at);
                    this.dom.getChildByID(subname+'_playable').classList.add('hidden');
                    this.dom.getChildByID(subname+'_completed').classList.remove('hidden');
                    this.dom.getChildByID(subname+'_timestamp').append( 
                        document.createTextNode(' '+timestamp+' ago') );
                    this.dom.getChildByID(subname+'_score').append( 
                        document.createTextNode(' '+subdata.score) );
                }
            });
        });
    }

    show (set=true) 
    {
        if (set) setTimeout(() => this.intro.restart());
        else setTimeout(() => this.exit.restart());
        return this;
    }

    eventListeners () 
    {
        this.dom.getChildByID('btn_close').addEventListener('click', () => {
            this.exit.restart();
        });
        this.dom.getChildByID('btn_leaderboard').addEventListener('click', () => {
            this.leaderboard.args.type = 'module';
            this.leaderboard.args.module = this.module;
            this.leaderboard.fetch_data().show();
        });
        this.submodules.forEach(subname => {
            this.dom.getChildByID(subname+'_btn').addEventListener('click', () => {
                this.scene.scene.start(this.module+'_'+subname);
            });
            this.dom.getChildByID(subname+'_leaderboard').addEventListener('click', () => {
                this.leaderboard.args.type = 'submodule';
                this.leaderboard.args.module = this.module;
                this.leaderboard.args.submodule = this.module+'_'+subname;
                this.leaderboard.fetch_data().show();
            });
        });
    }

    getElapseTime (timestamp) 
    {
        let start = new Date(timestamp);
        let end = new Date();
        let timeDifference = (end - start) / 1000 | 0;

        let toMinutes = (timeDifference / 60);
        let toHours = (timeDifference / 60) / 60;
        
        let seconds = (timeDifference % 60) | 0;
        let minutes = (toMinutes % 60) | 0;
        let hours = (toHours % 24) | 0;
        let days = (toHours / 24) | 0;

        if (days > 0) return days+' days '+hours+' hrs';
        if (hours > 0) return hours+' hrs '+minutes+' mins';
        return minutes+' mins '+seconds+' sec';
    }
}



class GM1_Interface extends Submodules_Interface
{
    constructor (scene, args={}) 
    {
        let submodules = ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'];
        super(scene, {module:'gm1', submodules:submodules});
        scene.add.existing(this);
    }
}

class GM2_Interface extends Submodules_Interface
{
    constructor (scene, args={}) 
    {
        let submodules = ['e1', 'e2', 'e3', 'e4', 'e5'];
        super(scene, {module:'gm2', submodules:submodules});
        scene.add.existing(this);
    }
}

class GM3_Interface extends Submodules_Interface
{
    constructor (scene, args={}) 
    {
        let submodules = ['e1', 'e2', 'e3', 'e4'];
        super(scene, {module:'gm3', submodules:submodules});
        scene.add.existing(this);
    }
}



export {
    GM1_Interface, GM2_Interface, GM3_Interface
};
