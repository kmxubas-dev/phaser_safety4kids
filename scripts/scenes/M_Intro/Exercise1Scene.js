import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Popup } from "../../classes/Popup.js";
import { Video } from "../../classes/Video.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";

export class Exercise1Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'intro_e1'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.popup = new Popup(this);
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        setTimeout(() => { this.animation_video.play(); }, 800);
        // INTRO - End

        // CREATE - Start
        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2, 'bg');

        this.narrator = new Narrator(this);
        this.animation_video = new Video(this, {title:'Introducing Dawn', video:'INTRO_E1'});
        this.animation_video.exit.on('active', () => {
            this.narrator.exit.once('active', () => {
                this.loader.show();
                this.api.usersubmodule_create({
                    module_key:'intro', submodule_key:'intro_e1', score:500, data:{data:null}
                }).then(res => {
                    this.loader.show(false);
                    this.loader.exit.once('complete', () => {
                        this.popup.finish(`Congratulations!`, `You have completed this exercise.${
                            '\n\n'}At the end of every exercise, you will see this ${
                            '\n'}completion screen and the [color=#275eb7]Continue[/color] ${
                            ''}button.`, 'intro');
                    });
                });
            });
            this.narrator.setText(`Good job!`, `When you see a [color=#275eb7]Continue[/color] ${
                ''}button, \nit means you can carry on to the next part.`).show();
        });
        // CREATE - End
    }

    update () 
    {

    }
}
