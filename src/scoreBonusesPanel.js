import * as PIXI from 'pixi.js'

export class ScoreBonusesPanel {
    #sprite;
    
    constructor(x, y, width, height) {
        this.#sprite = new PIXI.Container();

        let dom_container = document.querySelector('.container');
        let dom_canvas = document.querySelector('canvas');
        if (dom_container && dom_canvas) {
            const bounds = dom_canvas.getBoundingClientRect();
            dom_container.style.left = `${bounds.left}px`;
            dom_container.style.top = `${bounds.top}px`;
            dom_container.style.width = `${bounds.width}px`;
            dom_container.style.height = `${bounds.height}px`;
        }

        /*let panelSprite = new PIXI.Graphics();
        panelSprite.beginFill(0x00bcd4);
        panelSprite.drawRect(0, 0, width, height);
        panelSprite.endFill();
        panelSprite.x = x;
        panelSprite.y = y;
        this.#sprite.addChild(panelSprite);*/
    }

    getSprite() {
        return this.#sprite;
    }
}