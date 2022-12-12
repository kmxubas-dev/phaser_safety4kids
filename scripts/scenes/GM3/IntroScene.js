import { Video } from "../../classes/Video.js";
import { Menu } from "../../classes/Menu.js";

export class IntroScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm3_intro'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.menu = new Menu(this, {}).setLayout('dev').show();
    }

    create () 
    {
        this.anims_placeholder = new Video(this, {title:'Family and Relationships', video:'GM3'});
        this.anims_placeholder.play();
        this.anims_placeholder.exit.on('active', () => this.scene.start('gm3_e1'));
    }

    update () 
    {

    }
}