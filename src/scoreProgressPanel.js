import * as PIXI from 'pixi.js'

export class ScoreProgressPanel {
    #sprite;

    constructor(x, y, width, height) {
        this.#sprite = new PIXI.Container();
    }

    getSprite() {
        return this.#sprite;
    }
}