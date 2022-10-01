import * as PIXI from 'pixi.js'

export class Cell {
    #sprite; #size;

    /*
    x, y - позиция спрайта в пикселях
    size - размер спрайта в пикселях
    */
    constructor(x, y, size) {
        this.#sprite = new PIXI.Container();
        this.#sprite.x = x;
        this.#sprite.y = y;
        this.#size = size;

        let testSprite = new PIXI.Graphics();
        testSprite.beginFill(0x888888);
        testSprite.drawRect(5, 5, this.#size - 10, this.#size - 10);
        testSprite.endFill();
        this.#sprite.addChild(testSprite);
    }

    getSprite() {
        return this.#sprite;
    }
}