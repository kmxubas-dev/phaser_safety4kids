import { API } from "../classes/API.js";
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
            {scene:'dev', name:'Menu'},
            // {scene:'auth_login', name:'Login'},
            // {scene:'auth_register', name:'Register'},
            {scene:'gm_interface', name:'General Interface'},
            {scene:'gm_completion', name:'Overall Completion'},
            // 'loading',
        ];
        this.scenes_intro = [
            {scene:'intro_interface', name:'Introduction Module Interface'},
            {scene:'intro_e1', name:'Introducing Dawn'},
            {scene:'intro_e2', name:'What Is Domestic Violence?'},
            {scene:'intro_e3', name:'Affirmations'},
            {scene:'intro_completion', name:'Introduction Module Completion'}
        ];
        this.scenes_gm1 = [
            {scene:'gm1_intro', name:'My Feelings and Emotions Intro'},
            {scene:'gm1_e1', name:'Feelings in the Body'},
            {scene:'gm1_e2', name:'My Worries'},
            {scene:'gm1_e3', name:'Face Masks'},
            {scene:'gm1_e4', name:'What I Can and Can\’t Control'},
            {scene:'gm1_e5', name:'Managing Your Anger'},
            {scene:'gm1_e6', name:'The Feel Good File'},
            {scene:'gm1_completion', name:'GM1 Completion'}
        ];
        this.scenes_gm2 = [
            {scene:'gm2_intro', name:'Safety Intro'},
            {scene:'gm2_e1', name:'Superheroes and Magic'},
            {scene:'gm2_e2', name:'The Safety Hand'},
            {scene:'gm2_e3', name:'Helpful Communities'},
            {scene:'gm2_e4', name:'Safety Planning'},
            {scene:'gm2_e5', name:'Online Safety'},
            {scene:'gm2_completion', name:'GM2 Completion'}
        ];
        this.scenes_gm3 = [
            {scene:'gm3_intro', name:'Family and Relationships Intro'},
            {scene:'gm3_e1', name:'Family Structures'},
            {scene:'gm3_e2', name:'What Are My Rights?'},
            {scene:'gm3_e3', name:'Letter to My Parents'},
            {scene:'gm3_e4', name:'Respectful Relationsips'},
            {scene:'gm3_completion', name:'GM3 Completion'}
        ];
    }

    preload () 
    {
        this.api = new API();
        this.sound.stopAll();
        this.cameras.main.setBackgroundColor(0x308880);
        this.add.image(this.scale.width/2, this.scale.height/2-0.5, 'bg').setScale(1);
        this.add.image(440, 250, 'agik_white').setScale(0.3);
        this.api.auth_check().then((res) => { if (!res) this.scene.start('auth_login'); });
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

        x = this.scale.width/2;
        y = 95;
        this.scenes_gm1.forEach((scene, i) => {
            let btn = new Button(this, x, y, {w:330, h:100, txt:scene.name, txtsize:'3.5em'})
                .setButton('blue').setVisible(true).on('pointerdown', () => {
                    this.scene.start(scene.scene);
                });
            y += 111;
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
