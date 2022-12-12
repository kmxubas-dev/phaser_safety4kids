import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";

export class LoginScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'auth_login'
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
        let element = this.add.dom(w/2, h*-1).createFromCache('dom_auth_login');
        /*** Create Objects - End ***/

        element.getChildByID('form').addEventListener('submit', (event) => {
            event.preventDefault();
            let data = {
                username: element.getChildByID('username').value,
                password: element.getChildByID('password').value,
            }

            element.setVisible(false);
            this.loader.show();

            /*** API call - login ***/
            this.api.login(data).then((res) => {
                this.loader.show(false);
                setTimeout(() => element.setVisible(true), 900);

                if (res.errors) {
                    let errors = res.errors;
                    let parameters = ['username', 'password'];
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
                    setTimeout(() => { this.scene.start('intro_interface'); }, 900);
                }
            });
        });

        /*** Eventlistener - register button ***/
        element.getChildByID('btn_register').addEventListener('click', () => {
            this.scene.start('auth_register');
        });

        /*** Eventlistener - reset button ***/
        element.getChildByID('btn_reset').addEventListener('click', () => {
            this.scene.start('auth_reset');
        });

        /*** Animation - Login form ***/
        this.tweens.add({
            targets:element, y:this.scale.height/2+80, duration:2000, ease:'Power3',
            onComplete: () => { logo.setVisible(true); }
        });
    }

    update () 
    {

    }
}
