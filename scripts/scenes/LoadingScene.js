import { ProgressBar } from '../classes/Progress.js';
import { ASSETS } from './../ENV.js'

export class LoadingScene extends Phaser.Scene 
{
    constructor () 
    {
        super({
            key: 'loading'
        });
    }



    init () 
    {

    }

    preload () 
    {
        this.load.plugin('rexbbcodetextplugin', 
            'radv_phaser/dependencies/rexbbcodetextplugin.min.js', true);
        this.load.image('bg', ASSETS.BG.BG);
        this.load.image('bg_popup', ASSETS.BG.POPUP);
        this.load.image('bg_title', ASSETS.BG.TITLE);
        this.load.image('bg_narrator', ASSETS.BG.NARRATOR);
        this.load.image('bg_video', ASSETS.BG.VIDEO);
        this.load.image('bg_quiz', ASSETS.BG.QUIZ);
        this.load.image('bg_intro_e3', ASSETS.BG.INTRO_E3);
        this.load.image('bg_intro_interface', ASSETS.BG.INTRO_INTERFACE);
        this.load.image('bg_gm_interface', ASSETS.BG.GM_INTERFACE);
        this.load.image('bg_gm1_e1', ASSETS.BG.GM1_E1);
        this.load.image('bg_gm1_e2', ASSETS.BG.GM1_E2);
        this.load.image('bg_gm1_e3', ASSETS.BG.GM1_E3);
        this.load.image('bg_gm1_e4', ASSETS.BG.GM1_E4);
        this.load.image('bg_gm1_e5', ASSETS.BG.GM1_E5);
        this.load.image('bg_gm1_e6', ASSETS.BG.GM1_E6);
        this.load.image('bg_gm2_e2', ASSETS.BG.GM2_E2);
        this.load.image('bg_gm2_e3', ASSETS.BG.GM2_E3);
        this.load.image('bg_gm2_e4', ASSETS.BG.GM2_E4);
        this.load.image('bg_gm2_e5', ASSETS.BG.GM2_E5);
        this.load.image('bg_gm3_e1', ASSETS.BG.GM3_E1);
        this.load.image('bg_gm3_e3', ASSETS.BG.GM3_E3);
        this.load.image('bg_gm3_e4', ASSETS.BG.GM3_E4);

        this.load.html('dom_menu', ASSETS.DOM.MENU);
        this.load.html('dom_leaderboard', ASSETS.DOM.LEADERBOARD);
        this.load.html('dom_auth_login', ASSETS.DOM.AUTH_LOGIN);
        this.load.html('dom_auth_register', ASSETS.DOM.AUTH_REGISTER);
        this.load.html('dom_auth_reset', ASSETS.DOM.AUTH_RESET);
        this.load.html('dom_gm1_interface', ASSETS.DOM.GM1_INTERFACE);
        this.load.html('dom_gm2_interface', ASSETS.DOM.GM2_INTERFACE);
        this.load.html('dom_gm3_interface', ASSETS.DOM.GM3_INTERFACE);
        this.load.html('dom_gm1_e3', ASSETS.DOM.GM1_E3);
        this.load.html('dom_gm1_e7', ASSETS.DOM.GM1_E7);
        // this.load.video('vid_placeholder', ASSETS.VIDS.PLACEHOLDER, 'loadeddata', false, true);
        this.load.audio('sfx_completion', ASSETS.AUDIO.SFX_COMPLETION);
        this.load.audio('sfx_main', ASSETS.AUDIO.SFX_MAIN);
        this.load.audio('sfx_buzz', ASSETS.AUDIO.SFX_BUZZ);
        this.load.audio('sfx_paper_crumple', ASSETS.AUDIO.SFX_PAPER_CRUMPLE);
        this.load.audio('sfx_pop_sm', ASSETS.AUDIO.SFX_POP_SM);
        this.load.audio('sfx_coin_collect', ASSETS.AUDIO.SFX_COIN_COLLECT);
        this.load.audio('sfx_intro_e3_1', ASSETS.AUDIO.INTRO_E3_1);
        this.load.audio('sfx_intro_e3_2', ASSETS.AUDIO.INTRO_E3_2);
        this.load.audio('sfx_intro_e3_3', ASSETS.AUDIO.INTRO_E3_3);

        this.load.image('intro_interface_logo', ASSETS.INTRO.LOGO);
        this.load.image('intro_interface_arrow', ASSETS.INTRO.ARROW);
        this.load.atlas('intro_interface_items', ASSETS.INTRO.ITEMS, ASSETS.INTRO.ITEMS_JSON);
        this.load.atlas('intro_e3_assets', ASSETS.INTRO.E3_ASSETS, ASSETS.INTRO.E3_ASSETS_JSON);
        this.load.atlas('gm_interface_items', ASSETS.GM.ITEMS, ASSETS.GM.ITEMS_JSON);

        this.load.image('gm1_e1_dish', ASSETS.GM1.E1_DISH);
        this.load.atlas('gm1_e1_face', ASSETS.GM1.E1_FACE, ASSETS.GM1.E1_FACE_JSON);
        this.load.atlas('gm1_e1_items', ASSETS.GM1.E1_ITEMS, ASSETS.GM1.E1_ITEMS_JSON);
        this.load.atlas('gm1_e2_balloons', ASSETS.GM1.E2_BALLOONS, ASSETS.GM1.E2_BALLOONS_JSON);
        this.load.animation('gm1_e2_balloons_animation', ASSETS.GM1.E2_BALLOONS_ANIMATION);
        this.load.atlas('gm1_e3_mask', ASSETS.GM1.E3_MASK, ASSETS.GM1.E3_MASK_JSON);
        this.load.image('gm1_e3_note', ASSETS.GM1.E3_NOTE);
        this.load.atlas('gm1_e4_assets', ASSETS.GM1.E4_ASSETS, ASSETS.GM1.E4_ASSETS_JSON);
        this.load.atlas('gm1_e5_assets', ASSETS.GM1.E5_ASSETS, ASSETS.GM1.E5_ASSETS_JSON);
        this.load.atlas('gm1_e6_assets', ASSETS.GM1.E6_ASSETS, ASSETS.GM1.E6_ASSETS_JSON);
        this.load.atlas('gm1_e6_items', ASSETS.GM1.E6_ITEMS, ASSETS.GM1.E6_ITEMS_JSON);

        this.load.image('gm2_e1_bg', ASSETS.GM2.E1_BG);
        this.load.atlas('gm2_e1_coin', ASSETS.GM2.E1_COIN, ASSETS.GM2.E1_COIN_JSON);
        this.load.atlas('gm2_e1_character', ASSETS.GM2.E1_CHARACTER, ASSETS.GM2.E1_CHARACTER_JSON);
        this.load.animation('gm2_e1_character_animation', ASSETS.GM2.E1_CHARACTER_ANIMATION);
        this.load.atlas('gm2_e2_items', ASSETS.GM2.E2_ITEMS, ASSETS.GM2.E2_ITEMS_JSON);
        this.load.atlas('gm2_e3_assets', ASSETS.GM2.E3_ASSETS, ASSETS.GM2.E3_ASSETS_JSON);
        this.load.atlas('gm2_e3_buttons', ASSETS.GM2.E3_BUTTONS, ASSETS.GM2.E3_BUTTONS_JSON);
        this.load.image('gm2_e3_tileset', ASSETS.GM2.E3_TILESET);
        this.load.tilemapTiledJSON('gm2_e3_tilemap', ASSETS.GM2.E3_TILEMAP);
        this.load.atlas('gm2_e3_character', ASSETS.GM2.E3_CHARACTER, ASSETS.GM2.E3_CHARACTER_JSON);
        this.load.animation('gm2_e3_character_animation', ASSETS.GM2.E3_CHARACTER_ANIMATION);
        this.load.atlas('gm2_e3_npc', ASSETS.GM2.E3_NPC, ASSETS.GM2.E3_NPC_JSON);
        this.load.atlas('gm2_e3_speeches', ASSETS.GM2.E3_SPEECHES, ASSETS.GM2.E3_SPEECHES_JSON);
        this.load.atlas('gm2_e4_assets', ASSETS.GM2.E4_ASSETS, ASSETS.GM2.E4_ASSETS_JSON);
        this.load.atlas('gm2_e4_buttons', ASSETS.GM2.E4_BUTTONS, ASSETS.GM2.E4_BUTTONS_JSON);
        this.load.atlas('gm2_e5_panels', ASSETS.GM2.E5_PANELS, ASSETS.GM2.E5_PANELS_JSON);

        this.load.atlas('gm3_e1_items', ASSETS.GM3.E1_ITEMS, ASSETS.GM3.E1_ITEMS_JSON);
        this.load.atlas('gm3_e3_assets', ASSETS.GM3.E3_ASSETS, ASSETS.GM3.E3_ASSETS_JSON);
        this.load.atlas('gm3_e4_assets', ASSETS.GM3.E4_ASSETS, ASSETS.GM3.E4_ASSETS_JSON);

        this.load.image('logo', ASSETS.LOGO)
        this.load.image('agik_white', ASSETS.AGIK_WHITE);
        this.load.image('agik_black', ASSETS.AGIK_BLACK);
        this.load.image('frame', ASSETS.FRAME);
        this.load.image('board', ASSETS.BOARD);
        this.load.image('helpline', ASSETS.HELPLINE);
        this.load.atlas('characters_narrator', ASSETS.NARRATOR, ASSETS.NARRATOR_JSON);
        this.load.image('papernote', ASSETS.PAPERNOTE);
        this.load.atlas('quiz_assets', ASSETS.QUIZ_ASSETS, ASSETS.QUIZ_ASSETS_JSON);

        this.load.image('paint_brush1', ASSETS.PAINT.BRUSH1);
        this.load.image('paint_brush2', ASSETS.PAINT.BRUSH2);
        this.load.image('paint_brush3', ASSETS.PAINT.BRUSH3);

        this.load.atlas('gui_shapes', ASSETS.GUI.SHAPES, ASSETS.GUI.SHAPES_JSON);
        this.load.atlas('gui_btns', ASSETS.GUI.BUTTONS, ASSETS.GUI.BUTTONS_JSON);
        this.load.atlas('btns_menu', ASSETS.BUTTONS.MENU, ASSETS.BUTTONS.MENU_JSON);



        let progressBar = new ProgressBar(this).setDepth(1).setVisible(false);
        progressBar.updateText = (max=2, progress=1, args=this.args)  => {
            progressBar.text.setText(parseInt(progress/max*100)+'%'); }
        let loadingText = this.add.text(this.scale.width/2, this.scale.height/2-125, 'Loading',
            { align:'left', color:'#ffffff', fontSize:'8em', fontFamily:'Font_Header',
            wordWrap:{width:1100}, stroke:'#000000', strokeThickness:5 })
            .setOrigin(0.5, 0.5).setDepth(1).setVisible(false);



        this.load.on('start', () => {
            //
        });
        this.load.on('progress', (value) => {
            progressBar.drawProgress(100, parseInt(value*100));
        });
        this.load.on('fileprogress', (file, progress) => {
            //
        });
        this.load.on('filecomplete', (key, type, data) => {
            if (key === 'bg') {
                loadingText.setVisible(true);
                progressBar.setVisible(true);
                this.add.image(this.scale.width/2, this.scale.height/2-0.5, 'bg');
            }
        });
        this.load.on('complete', () => {
            progressBar.destroy();
        });
    }

    create () 
    {
        this.scene.start('auth_login');
    }

    update () 
    {

    }
}
