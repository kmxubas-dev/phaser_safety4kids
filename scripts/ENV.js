// ==================================================
// CONFIGURATIONS VARIABLES
// ==================================================

const PATHS = {
    assets: './../',
    dependencies: './../',
    scripts: './../',
    scripts_scenes: './../../',

    phaser_assets: 'radv_phaser/assets/'
}

const ASSETS = {
    GUI: {
        SHAPES: PATHS.phaser_assets+'GUI/GUI_SHAPES.png',
        SHAPES_JSON: PATHS.phaser_assets+'GUI/GUI_SHAPES.json',
        BUTTONS: PATHS.phaser_assets+'GUI/BUTTONS.png',
        BUTTONS_JSON: PATHS.phaser_assets+'GUI/BUTTONS.json',
    },
    BUTTONS: {
        MENU: PATHS.phaser_assets+'BUTTONS/MENU.png',
        MENU_JSON: PATHS.phaser_assets+'BUTTONS/MENU.json',
    },
    BG: {
        BG: PATHS.phaser_assets+'BG/BG.png',
        POPUP: PATHS.phaser_assets+'BG/POPUP.png',
        TITLE: PATHS.phaser_assets+'BG/TITLE.png',
        VIDEO: PATHS.phaser_assets+'BG/VIDEO.png',
        NARRATOR: PATHS.phaser_assets+'BG/NARRATOR.png',
        INTRO_E3: PATHS.phaser_assets+'BG/INTRO_E3.png',
        INTRO_INTERFACE: PATHS.phaser_assets+'BG/INTRO_INTERFACE.png',
        GM_INTERFACE: PATHS.phaser_assets+'BG/GM_INTERFACE.png',
        QUIZ: PATHS.phaser_assets+'BG/QUIZ.png',

        GM1_E1: PATHS.phaser_assets+'BG/GM1_E1.png',
        GM1_E2: PATHS.phaser_assets+'BG/GM1_E2.png',
        GM1_E3: PATHS.phaser_assets+'BG/GM1_E3.png',
        GM1_E4: PATHS.phaser_assets+'BG/GM1_E4.png',
        GM1_E5: PATHS.phaser_assets+'BG/GM1_E5.png',
        GM1_E6: PATHS.phaser_assets+'BG/GM1_E6.png',

        GM2_E2: PATHS.phaser_assets+'BG/GM2_E2.png',
        GM2_E3: PATHS.phaser_assets+'BG/GM2_E3.png',
        GM2_E4: PATHS.phaser_assets+'BG/GM2_E4.png',
        GM2_E5: PATHS.phaser_assets+'BG/GM2_E5.png',

        GM3_E1: PATHS.phaser_assets+'BG/GM3_E1.png',
        GM3_E3: PATHS.phaser_assets+'BG/GM3_E3.png',
        GM3_E4: PATHS.phaser_assets+'BG/GM3_E4.png',
    },
    DOM: {
        MENU: PATHS.phaser_assets+'DOM/MENU.html',
        LEADERBOARD: PATHS.phaser_assets+'DOM/LEADERBOARD.html',
        AUTH_LOGIN: PATHS.phaser_assets+'DOM/Auth_Login.html',
        AUTH_REGISTER: PATHS.phaser_assets+'DOM/Auth_Register.html',
        AUTH_RESET: PATHS.phaser_assets+'DOM/Auth_Reset.html',
        GM1_INTERFACE: PATHS.phaser_assets+'DOM/GM1_INTERFACE.html',
        GM2_INTERFACE: PATHS.phaser_assets+'DOM/GM2_INTERFACE.html',
        GM3_INTERFACE: PATHS.phaser_assets+'DOM/GM3_INTERFACE.html',
        GM1_E3: PATHS.phaser_assets+'DOM/GM1_E3.html',
        GM1_E7: PATHS.phaser_assets+'DOM/GM1_E7.html',
    },
    VIDS: {
        PLACEHOLDER: PATHS.phaser_assets+'VIDS/PLACEHOLDER.mp4',
    },
    AUDIO: {
        SFX_MAIN: PATHS.phaser_assets+'AUDIO/SFX_MAIN.ogg',
        SFX_COMPLETION: PATHS.phaser_assets+'AUDIO/SFX_COMPLETION.ogg',
        SFX_BUZZ: PATHS.phaser_assets+'AUDIO/SFX_BUZZ.ogg',
        SFX_PAPER_CRUMPLE: PATHS.phaser_assets+'AUDIO/SFX_PAPER_CRUMPLE.ogg',
        SFX_POP_SM: PATHS.phaser_assets+'AUDIO/SFX_POP_SM.ogg',
        SFX_COIN_COLLECT: PATHS.phaser_assets+'AUDIO/SFX_COIN_COLLECT.ogg',

        INTRO_E3_1: PATHS.phaser_assets+'AUDIO/INTRO_E3_1.mp3',
        INTRO_E3_2: PATHS.phaser_assets+'AUDIO/INTRO_E3_2.mp3',
        INTRO_E3_3: PATHS.phaser_assets+'AUDIO/INTRO_E3_3.mp3'
    },
    CURSORS: {
        NEEDLE: PATHS.phaser_assets+'CURSORS/NEEDLE.cur',
    },
    PAINT: {
        BRUSH1: PATHS.phaser_assets+'PAINT/BRUSH1.png',
        BRUSH2: PATHS.phaser_assets+'PAINT/BRUSH2.png',
        BRUSH3: PATHS.phaser_assets+'PAINT/BRUSH3.png',
    },

    INTRO: {
        LOGO: PATHS.phaser_assets+'GM/INTRO_LOGO.png',
        ARROW: PATHS.phaser_assets+'GM/INTRO_ARROW.png',
        ITEMS: PATHS.phaser_assets+'GM/INTRO_ITEMS.png',
        ITEMS_JSON: PATHS.phaser_assets+'GM/INTRO_ITEMS.json',
        E3_ASSETS: PATHS.phaser_assets+'GM/INTRO_E3_ASSETS.png',
        E3_ASSETS_JSON: PATHS.phaser_assets+'GM/INTRO_E3_ASSETS.json',
    },
    GM: {
        ITEMS: PATHS.phaser_assets+'GM/GM_INTERFACE_ITEMS.png',
        ITEMS_JSON: PATHS.phaser_assets+'GM/GM_INTERFACE_ITEMS.json',
    },
    GM1: {
        E1_DISH: PATHS.phaser_assets+'GM1/GM1_E1_DISH.png',
        E1_FACE: PATHS.phaser_assets+'GM1/GM1_E1_FACE.png',
        E1_FACE_JSON: PATHS.phaser_assets+'GM1/GM1_E1_FACE.json',
        E1_ITEMS: PATHS.phaser_assets+'GM1/GM1_E1_ITEMS.png',
        E1_ITEMS_JSON: PATHS.phaser_assets+'GM1/GM1_E1_ITEMS.json',
        E2_BALLOONS: PATHS.phaser_assets+'GM1/E2_BALLOONS.png',
        E2_BALLOONS_JSON: PATHS.phaser_assets+'GM1/E2_BALLOONS.json',
        E2_BALLOONS_ANIMATION: PATHS.phaser_assets+'GM1/E2_BALLOONS_ANIMATION.json',
        E3_MASK: PATHS.phaser_assets+'GM1/GM1_E3_MASK.png',
        E3_MASK_JSON: PATHS.phaser_assets+'GM1/GM1_E3_MASK.json',
        E3_NOTE: PATHS.phaser_assets+'GM1/GM1_E3_NOTE.png',
        E4_ASSETS: PATHS.phaser_assets+'GM1/E4_ASSETS.png',
        E4_ASSETS_JSON: PATHS.phaser_assets+'GM1/E4_ASSETS.json',
        E5_ASSETS: PATHS.phaser_assets+'GM1/E5_ASSETS.png',
        E5_ASSETS_JSON: PATHS.phaser_assets+'GM1/E5_ASSETS.json',
        E6_ASSETS: PATHS.phaser_assets+'GM1/E6_ASSETS.png',
        E6_ASSETS_JSON: PATHS.phaser_assets+'GM1/E6_ASSETS.json',
        E6_ITEMS: PATHS.phaser_assets+'GM1/E6_ITEMS.png',
        E6_ITEMS_JSON: PATHS.phaser_assets+'GM1/E6_ITEMS.json',
    },
    GM2: {
        E1_BG: PATHS.phaser_assets+'GM2/E1_BG.png',
        E1_COIN: PATHS. phaser_assets+'GM2/E1_COIN.png',
        E1_COIN_JSON: PATHS. phaser_assets+'GM2/E1_COIN.json',
        E1_CHARACTER: PATHS.phaser_assets+'GM2/E1_CHARACTER.png',
        E1_CHARACTER_JSON: PATHS.phaser_assets+'GM2/E1_CHARACTER.json',
        E1_CHARACTER_ANIMATION: PATHS.phaser_assets+'GM2/E1_CHARACTER_ANIMATION.json',
        E2_ITEMS: PATHS.phaser_assets+'GM2/E2_ITEMS.png',
        E2_ITEMS_JSON: PATHS.phaser_assets+'GM2/E2_ITEMS.json',
        E3_ASSETS: PATHS.phaser_assets+'GM2/E3_ASSETS.png',
        E3_ASSETS_JSON: PATHS.phaser_assets+'GM2/E3_ASSETS.json',
        E3_BUTTONS: PATHS.phaser_assets+'GM2/E3_BUTTONS.png',
        E3_BUTTONS_JSON: PATHS.phaser_assets+'GM2/E3_BUTTONS.json',
        E3_TILESET: PATHS.phaser_assets+'GM2/E3_TILESET.png',
        E3_TILEMAP: PATHS.phaser_assets+'GM2/E3_TILEMAP.json',
        E3_CHARACTER: PATHS.phaser_assets+'GM2/E3_CHARACTER.png',
        E3_CHARACTER_JSON: PATHS.phaser_assets+'GM2/E3_CHARACTER.json',
        E3_CHARACTER_ANIMATION: PATHS.phaser_assets+'GM2/E3_CHARACTER_ANIMATION.json',
        E3_NPC: PATHS.phaser_assets+'GM2/E3_NPCS.png',
        E3_NPC_JSON: PATHS.phaser_assets+'GM2/E3_NPCS.json',
        E3_NPC_ANIMATION: PATHS.phaser_assets+'GM2/E3_NPCS_ANIMATION.json',
        E3_SPEECHES: PATHS.phaser_assets+'GM2/E3_SPEECHES.png',
        E3_SPEECHES_JSON: PATHS.phaser_assets+'GM2/E3_SPEECHES.json',
        E4_ASSETS: PATHS.phaser_assets+'GM2/E4_ASSETS.png',
        E4_ASSETS_JSON: PATHS.phaser_assets+'GM2/E4_ASSETS.json',
        E4_BUTTONS: PATHS.phaser_assets+'GM2/E4_BUTTONS.png',
        E4_BUTTONS_JSON: PATHS.phaser_assets+'GM2/E4_BUTTONS.json',
        E5_PANELS: PATHS.phaser_assets+'GM2/E5_PANELS.png',
        E5_PANELS_JSON: PATHS.phaser_assets+'GM2/E5_PANELS.json',
    },
    GM3: {
        E1_ITEMS: PATHS.phaser_assets+'GM3/E1_ITEMS.png',
        E1_ITEMS_JSON: PATHS.phaser_assets+'GM3/E1_ITEMS.json',
        E3_ASSETS: PATHS.phaser_assets+'GM3/E3_ASSETS.png',
        E3_ASSETS_JSON: PATHS.phaser_assets+'GM3/E3_ASSETS.json',
        E4_ASSETS: PATHS.phaser_assets+'GM3/E4_ASSETS.png',
        E4_ASSETS_JSON: PATHS.phaser_assets+'GM3/E4_ASSETS.json',
    },

    LOGO: PATHS.phaser_assets+'LOGO.png',
    AGIK_WHITE: PATHS.phaser_assets+'AGIK_WHITE.png',
    AGIK_BLACK: PATHS.phaser_assets+'AGIK_BLACK.png',
    FRAME: PATHS.phaser_assets+'FRAME.png',
    BOARD: PATHS.phaser_assets+'BOARD.png',
    HELPLINE: PATHS.phaser_assets+'HELPLINE.png',
    PAPERNOTE: PATHS.phaser_assets+'PAPERNOTE.png',
    NARRATOR: PATHS.phaser_assets+'NARRATOR.png',
    NARRATOR_JSON: PATHS.phaser_assets+'NARRATOR.json',
    QUIZ_ASSETS: PATHS.phaser_assets+'QUIZ_ASSETS.png',
    QUIZ_ASSETS_JSON: PATHS.phaser_assets+'QUIZ_ASSETS.json'
}

export { PATHS, ASSETS };
