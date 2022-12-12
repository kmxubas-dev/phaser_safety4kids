// ==================================================
// LOADING INTERFACE CLASS
// ==================================================

import { API } from "./API.js";

export class Leaderboard extends Phaser.GameObjects.Container 
{
    constructor (scene, args={}) 
    {
        super(scene, scene.scale.width/2, scene.scale.height/2).setAlpha(0)
            .setSize(scene.scale.width, scene.scale.height).setInteractive()
            .setScrollFactor(0, 0, true);
        scene.add.existing(this);

        this.api = new API;
        this.args = args || {};
        this.args.w = args.w || scene.scale.width;
        this.args.h = args.h || scene.scale.height;
        this.args.type = args.type || 'overall';
        this.args.module = args.module || 'gm1';
        this.args.submodule = args.submodule || 'gm1_e1';
        this.page_prev = 1;
        this.page_next = 1;

        this.intro = scene.tweens.add({targets:[this], alpha:1, duration:500}).pause()
            .on('complete', () => { this.scene.children.bringToTop(this); });
        this.exit = scene.tweens.add({targets:[this], alpha:0, duration:500}).pause()
            .on('complete', () => { });
        this.initialize();
        this.eventListeners();
    }



    initialize () 
    {
        this.dom = this.scene.add.dom(0, 0).createFromCache('dom_leaderboard')
            .setOrigin(0.5).setDepth(100);
        this.li_node = this.dom.getChildByID('list_item-sample').cloneNode(true);
        this.add(this.dom);

        this.dom_elements = {
            list: this.dom.getChildByID('list'),
            title_type: this.dom.getChildByID('title_type'),
            page_currrent: this.dom.getChildByID('page_current'),
            page_prev_arrow: this.dom.getChildByID('page_prev_arrow'),
            page_next_arrow: this.dom.getChildByID('page_next_arrow'),
            page_prev: this.dom.getChildByID('page_prev'),
            page_next: this.dom.getChildByID('page_next'),
            page_first: this.dom.getChildByID('page_first'),
            page_last: this.dom.getChildByID('page_last')
        }
        this.fetch_callback = res => {
            let dom = this.dom_elements;
            let ranks = res.users_submodule || {data:[]};
            let text_node = text => document.createTextNode(text);
            ranks.data.forEach((rank, i) => {
                let li = this.li_node.cloneNode(true);
                li.querySelector('.li_name').replaceChildren(text_node(rank.user.name));
                li.querySelector('.li_score').replaceChildren(text_node(rank.score));
                li.querySelector('.li_icon').replaceChildren(text_node(ranks.from+i));
                li.classList.remove('hidden');
                if (ranks.current_page === 1) {
                    let li_icon = li.querySelector('.li_icon');
                    if (i === 0)    li_icon.replaceChildren(text_node('🥇'));
                    else if (i === 1) li_icon.replaceChildren(text_node('🥈'));
                    else if (i === 2) li_icon.replaceChildren(text_node('🥉'));
                }
                dom.list.appendChild(li);
            });
            if (res.module === 'Overall') dom.title_type.classList.add('hidden');
            dom.title_type.replaceChildren(text_node(res.module+' - '+res.submodule));
            dom.page_currrent.replaceChildren(text_node(ranks.current_page));
            dom.page_prev.replaceChildren(text_node(ranks.current_page-1));
            dom.page_next.replaceChildren(text_node(ranks.current_page+1));
            dom.page_last.replaceChildren(text_node(ranks.last_page));
            if (ranks.current_page !== ranks.last_page) {
                this.page_next = ranks.current_page+1;
                dom.page_next_arrow.classList.remove('hidden');
            } else {
                dom.page_next.replaceChildren('');
                dom.page_next_arrow.classList.add('hidden');
            }
            if (ranks.current_page !== 1) {
                this.page_prev = ranks.current_page-1;
                dom.page_prev_arrow.classList.remove('hidden');
            } else {
                dom.page_prev.replaceChildren('');
                dom.page_prev_arrow.classList.add('hidden');
            }
        }
        this.fetch_data();
    }

    show (set=true) 
    {
        if (set) setTimeout(() => this.intro.restart());
        else setTimeout(() => this.exit.restart());
        return this;
    }

    eventListeners () 
    {
        let dom = this.dom_elements;
        this.dom.getChildByID('btn_close').addEventListener('click', () => {
            this.exit.restart();
        });
        dom.page_prev_arrow.addEventListener('click', () => {
            this.fetch_data(this.page_prev);
        });
        dom.page_next_arrow.addEventListener('click', () => {
            this.fetch_data(this.page_next);
        });
    }

    fetch_data (page=1) 
    {
        while (this.dom_elements.list.firstChild)
            this.dom_elements.list.removeChild(this.dom_elements.list.firstChild);
        if (this.args.type === 'overall') {
            this.api.leaderboard_overall(page).then(this.fetch_callback);
        } else if (this.args.type === 'module') {
            this.api.leaderboard_byModule(this.args.module, page).then(this.fetch_callback);
        } else if (this.args.type === 'submodule') {
            this.api.leaderboard_bySubmodule(this.args.module, this.args.submodule, page)
                .then(this.fetch_callback);
        }
        return this;
    }
}
