// ==================================================
// LOADING INTERFACE CLASS
// ==================================================
import { ProgressBar } from "./Progress.js";

export class Loader extends Phaser.GameObjects.Container 
{
    constructor (scene, args={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2).setAlpha(0)
            .setSize(scene.scale.width, scene.scale.height).setInteractive()
            .setDepth(100).setScrollFactor(0, 0, true);
        scene.add.existing(this);

        this.args = args || {};
        this.args.w = args.w || scene.scale.width;
        this.args.h = args.h || scene.scale.height;

        this.intro = scene.tweens.add({targets:[this], alpha:1, duration:100}).pause()
            .on('complete', () => { this.scene.children.bringToTop(this); });
        this.exit = scene.tweens.add({targets:[this], alpha:0, duration:250}).pause()
            .on('complete', () => { });
        this.initialize();
    }



    initialize (scene=this.scene, scale=this.scene.scale) 
    {
        var r1 = scene.add.rectangle(0, 0, scale.width, scale.height, 0x000000).setAlpha(0.9);
        this.txt = scene.add.text(0, -150, 'Loading', { align:'center', color:'#ffffff',
            fontSize:'8em', fontFamily:'Font_Header', wordWrap:{width:1100} }).setOrigin(0.5, 0);
            // stroke:'#A3CB38', strokeThickness:5
        this.progress = new ProgressBar(scene, 0, 0, {w:600});
        this.progress.setGraphics({type:'base', linew:2, linec:0x6ab04c, linea:1, l:true});
        this.progress.updateText = (max=2, progress=1, args=this.progress.args)  => {
            this.progress.text.setText(parseInt(progress/max*100)+'%'); }
        this.add([r1, this.progress, this.txt]);
    }

    show (set=true) 
    {
        let x = (set) ? 0:5;
        let xlimit = (set) ? 5:10;
        clearInterval(this.progress_interval);
        if (set) setTimeout(() => this.intro.restart());
        this.progress_interval = setInterval(() => {
            this.progress.drawProgress(100, parseInt(x*10));
            if (x++ === xlimit) {
                if (!set) this.exit.restart();
                clearInterval(this.progress_interval);
            };
        }, 100);
        return this;
    }
}
