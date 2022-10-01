import * as PIXI from 'pixi.js'

export class GameField {
    #sprite; #x; #y; #width; #height; #gemSize; #panelSprite;

    /*
    x - позиция в пикселях
    y - позиция в пикселях
    */
    constructor(x, y) {
        this.#sprite = new PIXI.Container();
        this.#x = x;
        this.#y = y;
        this.#width = 0;
        this.#height = 0;
        this.#gemSize = 0;

        this.#panelSprite = new PIXI.Graphics();
        this.#sprite.addChild(this.#panelSprite);
    }

    /*
    w - количество ячеек по горизонтали
    h - количество ячеек по вертикали
    maxWidth - доступная область в пикселях
    maxHeight - доступная область в пикселях
    */
    setDimensions(w, h, maxWidth, maxHeight) {
        const horizontal = w / h > maxWidth / maxHeight;
        this.#gemSize = horizontal ? maxWidth / w : maxHeight / h;
        this.#width = this.#gemSize * w;
        this.#height = this.#gemSize * h;
        this.#x = this.#x + (maxWidth - this.#width) / 2;
        this.#y = this.#y + (maxHeight - this.#height) / 2;
        return this;
    }

    get gemSize() {
        return this.#gemSize;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get position() {
        return {x: this.#x, y:this.#y};
    }

    /*
    разрешить игроку тыкать (фактически начать игру)
    */
    start() {
        if (!this.#gemSize || !this.#width || !this.#height) {
            throw new Error('Перед запуском надо вызвать setDimensions'); 
        }
        this.#panelSprite.beginFill(0xff9800);
        this.#panelSprite.drawRect(0, 0, this.#width, this.#height);
        this.#panelSprite.endFill();
        this.#panelSprite.x = this.#x;
        this.#panelSprite.y = this.#y;
        return this;
    }

    getSprite() {
        return this.#sprite;
    }
}