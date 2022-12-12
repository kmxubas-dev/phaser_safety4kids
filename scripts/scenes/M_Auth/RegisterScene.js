import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";

export class RegisterScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'auth_register'
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
        let logo = this.add.image(w/2, h/2-310, 'logo').setScale(0.5).setVisible(false);
        let element = this.add.dom(w/2, h*-1).createFromCache('dom_auth_register');
        /*** Create Objects - End ***/

        element.getChildByID('form').addEventListener('submit', (event) => {
            event.preventDefault();
            let data = {
                name:       element.getChildByID('name').value,
                username:   element.getChildByID('username').value,
                email:      element.getChildByID('email').value,
                password:   element.getChildByID('password').value,
                password_confirmation: element.getChildByID('passwordc').value
            }

            this.loader.show();

            /*** API call - register ***/
            this.api.register(data).then((res) => {
                this.loader.show(false);
                if (res.errors) {
                    let errors = res.errors;
                    let parameters = ['name', 'username', 'email', 'password'];
                    parameters.forEach((param) => {
                        if (errors[param]) {
                            element.getChildByID(param+'_error').classList.remove('hidden');
                            element.getChildByID(param+'_error').replaceChildren( 
                                document.createTextNode(errors[param]) );
                        } else {
                            element.getChildByID(param+'_error').classList.add('hidden');
                        }
                    });
                } else if (res === '') {
                    setTimeout(() => { this.scene.start('gm_interface'); });
                }
            });
        });

        /*** Eventlistener - login button ***/
        element.getChildByID('btn_login').addEventListener('click', () => {
            this.scene.start('auth_login');
        });

        /*** Animation - Register form ***/
        this.tweens.add({
            targets:element, y:this.scale.height/2+50, duration:2000, ease:'Power3',
            onComplete: () => { logo.setVisible(true); }
        });
    }

    update () 
    {

    }
}
