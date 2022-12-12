import { Video } from "../../classes/Video.js";
import { Menu } from "../../classes/Menu.js";

export class IntroScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm1_intro'
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
        this.anims_placeholder = new Video(this, {title:'Feelings and Emotions', video:'GM1'});
        this.anims_placeholder.play();
        this.anims_placeholder.exit.on('active', () => this.scene.start('gm1_e1'));
    }

    update () 
    {

    }
}
