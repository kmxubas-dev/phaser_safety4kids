import { API } from "../../classes/API.js";
import { Loader } from "../../classes/Loader.js";
import { Video } from "../../classes/Video.js";
import { Popup } from "../../classes/Popup.js";
import { Menu } from "../../classes/Menu.js";
import { Narrator } from "../../classes/Narrator.js";
import { Quiz } from "../../classes/Quiz.js";
import { GM3_E2 as QuizData } from "../../data/QUIZ.js";

export class Exercise2Scene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'gm3_e2'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.api = new API();
        this.loader = new Loader(this).show();
        this.popup = new Popup(this).window_setSize(880, 660);
        this.menu = new Menu(this).setLayout('dev').show();
    }

    create () 
    {
        // INTRO - Start
        this.api.progress_byModule('gm3').then(res => { 
            this.loader.show(false);
            if (res.progress < 1) this.scene.start('gm_interface');
            // this.anims_placeholder.show().play();
        });
        // INTRO - End

        let scale = this.scale;
        let frame = this.add.image(scale.width/2, scale.height/2, 'frame').setDepth(1000);
        let bg = this.add.image(scale.width/2, scale.height/2-0.5, 'bg');

        let narrator_step = 1;
        this.narrator = new Narrator(this);
        this.narrator.btn.removeListener('pointerdown', 
            this.narrator.btn.listeners('pointerdown')[1]);
        this.narrator.show(true).addText1(0, 50, 'What Are My Rights?')
            .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
            .addText3(0, 220, `Like adults, children have rights too. Like adults, ${
                '\n'}children have rights too. Rights are things that every ${
                '\n'}child should have or be able to do. Australia has promised ${
                '\n'}to protect children’s rights. ${
                '\n\n'}`);
        this.narrator.btn.once('pointerdown', () => {
            this.narrator.clearText().addText1(0, 50, 'What Are My Rights?')
                .addText2(0, 140, 'For You and Your Safe Adult to Talk About', '#3AA69D')
                .addText3(0, 220, `Many kids tell us that some adults and other people ${
                    '\n'}make big decisions about kids’ lives and don’t ask what ${
                    '\n'}kids feel and think about this. Kids then feel that they ${
                    '\n'}have no voice or rights and that is not okay. ${
                    '\n\n'}Your rights are important because they make sure that you  ${
                    '\n'}are given whatyou need in your life and are protected from ${
                    '\n'}harm. Let’s see if you can remember them.`);
            this.narrator.btn.on('pointerdown', () => this.narrator.hide());
        });
        // this.anims_placeholder = new Video(this, {title:'What Are My Rights?'}).setAlpha(0);
        // this.anims_placeholder.exit.on('active', () => {
            // this.quiz.question_txt.setText(`What Are My Rights?`);
            // this.quiz.start();
            // this.children.bringToTop(this.menu.btn);
        // });

        this.narrator.exit.once('complete', () => {
            this.narrator.setShow(false);
            setTimeout(() => {this.quiz.start();}, 500);
        });
        this.quiz = new Quiz(this, {items:QuizData.ITEMS});
        this.quiz.question_txt.setText(`What Are My Rights?`);
        this.quiz.finish = () => {
            this.loader.show();
            this.api.usersubmodule_create({
                module_key:'gm3', submodule_key:'gm3_e2', 
                score:this.quiz.score*100, data:{data:null}
            }).then(res => {
                this.loader.show(false);
                this.popup.finish(`Congratulations!`, `You have completed this exercise.\n\n${
                    ''}You got [color=#275eb7]${this.quiz.score} out of ${
                    this.quiz.data.get('items').length} answers correct[/color] ${
                    '\n'}and have earned [color=#275eb7]${this.quiz.score*100} ${
                    ''}points[/color] for completing this exercise.`);
            });
        }
    }

    update () 
    {

    }
}
