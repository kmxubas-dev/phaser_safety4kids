import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";

export class ResetScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'auth_reset'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
    }

    create () 
    {
        /*** API call - Check if logged in ***/
        this.api.auth_check().then((res) => { if (res) this.scene.start('gm_interface'); });

        /*** Create Objects - Start ***/
        let w = this.scale.width, h = this.scale.height;
        this.add.image(w/2, h/2-0.5, 'bg');
        let logo = this.add.image(w/2, h/2-300, 'logo').setScale(0.5).setVisible(false);
        let element = this.add.dom(w/2, h*-1).createFromCache('dom_auth_reset');
        /*** Create Objects - End ***/

        element.getChildByID('form').addEventListener('submit', (event) => {
            event.preventDefault();
            let data = {
                email: element.getChildByID('email').value,
            }

            element.setVisible(false);
            this.loader.show();

            /*** API call - reset password ***/
            this.api.reset(data).then((res) => {
                this.loader.show(false);
                setTimeout(() => element.setVisible(true), 900);
                console.log(res);
                if (res.errors) {
                    let errors = res.errors;
                    let parameters = ['email'];
                    parameters.forEach((param) => {
                        if (errors[param]) {
                            element.getChildByID(param+'_error').classList.remove('hidden');
                            element.getChildByID(param+'_error').replaceChildren( 
                                document.createTextNode(errors[param]) );
                        } else {
                            element.getChildByID(param+'_error').classList.add('hidden');
                        }
                    });
                } else if (res.two_factor !== undefined) {
                    // setTimeout(() => { this.scene.start('intro_interface'); });
                }
            });
        });

        /*** Eventlistener - login button ***/
        element.getChildByID('btn_login').addEventListener('click', () => {
            this.scene.start('auth_login');
        });

        /*** Eventlistener - register button ***/
        element.getChildByID('btn_register').addEventListener('click', () => {
            this.scene.start('auth_register');
        });

        /*** Animation - Reset Password form ***/
        this.tweens.add({
            targets:element, y:this.scale.height/2+80, duration:2000, ease:'Power3',
            onComplete: () => { logo.setVisible(true); }
        });
    }

    update () 
    {

    }
}
