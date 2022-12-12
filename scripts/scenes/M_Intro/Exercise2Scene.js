import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Video } from "../../classes/Video.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { INTRO_E2 as QuizData } from "../../data/QUIZ.js";

export class Exercise2Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'intro_e2'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this);
        this.popup = new Popup(this).window_setSize(800, 600);
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
        let bg_temp = this.add.image(scale.width/2, scale.height/2-0.5, 'bg');
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.animation_video = new Video(this, {title:'What is Domestic Violence?', video:'INTRO_E2'});
        this.animation_video.text.setFontSize('6em');
        this.animation_video.exit.on('active', () => {
            this.narrator.show().addText1(0, 40, 'What is Domestic Violence?')
                .addText2(0, 200, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                .addText3(0, 275, `Kids tell us often that they think they have done ${
                    '\n'}something to cause the violence in their family or ${
                    '\n'}they are blamed by the adult for the fighting and ${
                    '\n'}the violence. It makes them think that “It’s my ${
                    '\n'}fault that there is violence at home”.`);
            this.narrator.btn.on('pointerdown', () => {
                this.narrator.clearText().addText1(0, 40, 'What is Domestic Violence?')
                    .addText2(0, 200, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                    .addText3(0, 275, `This is not true. It is NEVER a child’s fault that there ${
                        '\n'}is domestic violence. The only person who is doing the ${
                        '\n'}wrong thing is the adult who is being a bully. ${
                        '\n\n'}You can talk to someone who can help you and your mum. ${
                        '\n'}Help is available for the person who is being abusive as ${
                        '\n'}well, they just have to ask.`);
                this.narrator.btn.removeListener('pointerdown', 
                    this.narrator.btn.listeners('pointerdown')[1]);
                this.narrator.btn.on('pointerdown', () => this.narrator.hide());
            });
            this.narrator.exit.once('complete', () => {
                this.quiz.start();
            });
        });
        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.finish = (popup=this.finish) => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'intro', submodule_key:'intro_e2', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                this.popup.txt.setLineSpacing(10);
                this.popup.finish(`Congratulations!`, `You have completed your first quiz.${
                    '\n'}[color=#275eb7]You have also earned some points![/color] ${
                    '\n'}You will earn points for every exercise you do. ${
                    '\n'}You have earned [color=#275eb7]${this.quiz.score*100} points[/color] ${
                    ''}for completing this quiz.${
                    '\n'}Click the [color=#275eb7]Continue[/color] button to go to the next ${
                    ''}exercise.`, `intro`);
            });
        }
        // CREATE - End
    }

    update () 
    {

    }
}
