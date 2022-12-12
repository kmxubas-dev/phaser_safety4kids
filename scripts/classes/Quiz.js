// ==================================================
// QUIZ INTERFACE CLASS
// ==================================================

import { Button } from "./Button.js";

class Quiz extends Phaser.GameObjects.Container 
{
    constructor (scene, data={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2).setDataEnabled()
            .setDepth(1).setAlpha(0);
        scene.add.existing(this);

        this.score = 0;
        this.step = 0;
        this.data.set('items', data.items);
        this.data.set('type', 'multi');
        this.instruction = `Read the questions and select the best answer.${
            '\n\n'}Click the [color=#275EB7]Start[/color] button to begin the quiz.`;
        let txt_subtitle = `[color=#275EB7]Let’s see what you can remember.[/color]`;

        this.choices = scene.add.container(this.x*-1, this.y*-1);
        this.bg = this.scene.add.image(0, -0.5, 'bg_quiz');
        this.narrator = scene.add.sprite(-650, 1080, 'characters_narrator', 'default').setScale(0.69);
        this.question_txt = scene.add.rexBBCodeText(-360, -290, 'Quiz', { align:'left', 
            color:'#000000',fontSize:'10em', fontFamily:'Font_Header', lineSpacing:0, 
            wordWrap:{width:880} }).setOrigin(0, 0);
        this.txt_subtitle = scene.add.rexBBCodeText(-360, -190, txt_subtitle, { align:'left',
            color:'#000000', fontSize:'6.9em', fontFamily:'Font_Header', lineSpacing:-20, 
            wordWrap:{width:880} }).setOrigin(0, 0);
        this.txt = scene.add.rexBBCodeText(-360, -100, this.instruction, { align:'left',
            color:'#000000', fontSize:'6.9em', fontFamily:'Font_Main', lineSpacing:-20, 
            wordWrap:{width:880} }).setOrigin(0, 0);

        this.btn_answer = new Button(this.scene, 500, 330, {w:275, txt:'Check Answer'})
            .setButton().setVisible(false).on('pointerdown', () => this.checkAnswer());
        this.btn_continue = new Button(this.scene, 500, 330, {w:250, txt:'Start'})
            .setButton().setVisible(false).on('pointerdown', () => {
                this.btn_continue.setVisible(false);
                if (this.step < this.data.get('items').length)
                    this.loadItem();
                else 
                    this.finish();
            }).once('pointerdown', () => {
                this.txt_subtitle.setVisible(false);
                this.question_txt.setFontSize('7.5em').setX(0).setOrigin(0.5, 0);
                this.txt.setAlign('center').setPosition(0, 300)
                    .setOrigin(0.5, 0.5).setVisible(false);
                this.btn_continue.btn_setText('Continue', '4.4em');
                this.narrator_exit.play();
            });

        for (let i=0; i<=6; i++) {
            let choice = scene.add.container(600, 600).setVisible(false);
            choice.base = scene.add.image(0, 0, 'quiz_assets', 'box');
            choice.base_content = scene.add.sprite(0, 0, 'quiz_assets').setVisible(false);
            choice.txt = scene.add.text(100, 0, 'Choice', { align:'left', color:'#000000', 
                fontSize:'6.9em', fontFamily:'Font_Main', lineSpacing:-25,
                wordWrap:{width:600} }).setOrigin(0, 0.5);
            choice.add([choice.base, choice.base_content, choice.txt]).setScrollFactor(0, 0, true);
            choice.status = false;
            choice.base.setScrollFactor(0, 0, true).on('pointerdown', () => {
                choice.status = !choice.status;
                choice.base_content.setVisible(choice.status).setFrame('check');
                if (this.data.get('items')[this.step].type !== 'multi') {
                    let choices_data = this.data.get('items')[this.step].choices;
                    choices_data.forEach((c, ii) => {
                        if (ii !== i) {
                            this.choices.list[ii].status = false;
                            this.choices.list[ii].base_content.setVisible(false);
                        }
                    });
                }
                let flag = this.choices.list.findIndex((c) => c.status === true);
                this.btn_answer.setVisible((flag !== -1));
            });
            this.choices.add(choice).setScrollFactor(0, 0, true);
        }
        this.data.get('items').forEach((item) => {
            let answers = 0;
            item.choices.forEach((choice) => { if (choice.value === 'true') answers++; });
            this.data.inc('score_max', answers);
            item.score_max = answers;
        });
        this.add([this.bg, this.narrator, this.question_txt, this.txt_subtitle, this.txt, 
            this.btn_answer, this.btn_continue, this.choices])
            .setSize(scene.scale.width, scene.scale.height)
            .setInteractive().setScrollFactor(0, 0, true);

        // TWEENS - Start
        this.intro = scene.tweens.createTimeline();
        this.intro.add({targets:this, alpha:1, duration:500});
        this.intro.add({targets:this.narrator, y:201, duration:500});
        this.intro.add({targets:this.narrator, y:200, duration:30});
        this.intro.add({targets:this.narrator, y:210, duration:30});
        this.intro.add({targets:this.narrator, y:250, duration:100});
        this.exit = scene.tweens.add({targets:this, alpha:0, duration:500}).pause();

        this.narrator_exit = scene.tweens.createTimeline();
        this.narrator_exit.add({targets:this.narrator, y:210, duration:100});
        this.narrator_exit.add({targets:this.narrator, y:200, duration:30});
        this.narrator_exit.add({targets:this.narrator, y:201, duration:30});
        this.narrator_exit.add({targets:this.narrator, y:1080, duration:500});
        // TWEENS - End
    }

    start () 
    {
        this.scene.children.bringToTop(this);
        this.scene.add.container(0, 0).destroy();
        this.intro.once('complete', () => {
                setTimeout(() => {
                    this.narrator.setFrame('thumbsup');
                    this.btn_continue.setVisible(true);
                }, 500);
            }).play();
    }

    finish (popup=this.scene.finish) 
    {
        popup.show(`Congratulations!\nYou have completed this exercise\nand scored ${
            this.score} out of ${this.data.get('items').length}.`);
    }

    loadItem (step=this.step) 
    {
        let item = this.data.get('items')[step];
        this.txt.setVisible(false);
        this.choices.list.forEach((choice) => choice.setVisible(false));
        item.choices.forEach((choice_data, i) => {
            let choice = this.choices.list[i];
            choice.status = false;
            choice.base.setInteractive({useHandCursor:true});
            choice.base_content.setVisible(false);
            choice.txt.setText(choice_data.description);
            choice.setPosition(choice_data.x, choice_data.y).setVisible(true);
        });
        this.question_txt.setText(item.question);
    }

    checkAnswer (data=this.data.get('items')[this.step]) 
    {
        let score = 0;
        let txt_feedback = ``;
        this.btn_answer.setVisible(false);
        setTimeout(() => this.btn_continue.setVisible(true), 500);
        data.choices.forEach((c, i) => {
            this.choices.list[i].base.removeInteractive();
            if (c.value === 'true' && this.choices.list[i].status)
                score++
            if (c.value === 'false' && this.choices.list[i].status) {
                if (score > 0) score--;
                this.choices.list[i].base_content.setFrame('cross').setVisible(true);
            }
        });

        if (this.data.get('items')[this.step].type === 'multi' && score === data.score_max) {
            this.score++;
            txt_feedback = `Well done, that's correct!`;
        } else if (this.data.get('items')[this.step].type !== 'multi' && score > 0) {
            this.score++
            txt_feedback = `Well done, that's correct!`;
        } else {
            txt_feedback = `Sorry, you didn't get that one correct...`
        };
        this.txt.setVisible(true).setText(txt_feedback);
        this.step++;
    }
}

export {
    Quiz
};
