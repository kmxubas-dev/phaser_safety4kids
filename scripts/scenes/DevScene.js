import { Button } from "../classes/Button.js";

export class DevScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'dev'
        });
    }



    init () 
    {
        this.allscenes = [
            {scene:'gm_interface', name:'General Interface'},
        ];
        this.scenes_intro = [
            {scene:'intro_interface', name:'Introduction Module Interface'},
        ];
        this.scenes_gm1 = [
            {scene:'gm1_e1', name:'Feelings in the Body'},
            {scene:'gm1_e2', name:'My Worries'},
            {scene:'gm1_e3', name:'Face Masks'},
            {scene:'gm1_e4', name:'What I Can and Can\’t Control'},
            {scene:'gm1_e5', name:'Managing Your Anger'},
            {scene:'gm1_e6', name:'The Feel Good File'},
        ];
        this.scenes_gm2 = [
            {scene:'gm2_e1', name:'Superheroes and Magic'},
            {scene:'gm2_e2', name:'The Safety Hand'},
            {scene:'gm2_e3', name:'Helpful Communities'},
            {scene:'gm2_e4', name:'Safety Planning'},
            {scene:'gm2_e5', name:'Online Safety'},
        ];
        this.scenes_gm3 = [
            {scene:'gm3_e1', name:'Family Structures'},
            {scene:'gm3_e2', name:'What Are My Rights?'},
            {scene:'gm3_e3', name:'Letter to My Parents'},
            {scene:'gm3_e4', name:'Respectful Relationsips'},
        ];
    }

    preload () 
    {
        this.sound.stopAll();
        this.cameras.main.setBackgroundColor(0x308880);
        this.add.image(this.scale.width/2, this.scale.height/2-0.5, 'bg').setScale(1);
        this.add.image(440, 250, 'agik_white').setScale(0.3);
    }

    create () 
    {
        let text_title = this.add.text(440, 380, 'Demo Shortcuts', { align:'center', 
            fontFamily:'Font_Header', fontSize:'5em', color:'#ffffff', wordWrap:{width:300}
        }).setOrigin(0.5, 0.5);

        let x = this.scale.width/2-700;
        let y = 540;
        this.allscenes.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:330, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('grey').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            y += 111;
        });

        x = this.scale.width/2-350;
        y = 540;
        this.scenes_intro.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:330, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('grey').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            y += 111;
        });

        x = 210;
        y = this.scale.height-100;
        this.scenes_gm1.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:290, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('blue').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            x += 300;
        });

        x = this.scale.width/2+350;
        y = 95;
        this.scenes_gm2.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:330, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('purple').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            y += 111;
        });

        x = this.scale.width/2+700;
        y = 95;
        this.scenes_gm3.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:330, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('pink').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            y += 111;
        });
    }

    update () 
    {

    }
}
