import * as PIXI from 'pixi.js'
import { Cell } from './cell.js';

export class GameField {
    #sprite; #x; #y; #width; #height; #gemSize; #bgSprite; #started; #size;

    /* спрайты камней. не несут логики - только отображение. каждый гем отвечает за отображение одной ячейки 
    (и не падает вниз вместе с камнями, ничего такого, просто следит за одной ячейкой и отрисовывает её состояние) */
    #gems;

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
        this.#started = false;

        this.#bgSprite = new PIXI.Graphics();
        this.#sprite.addChild(this.#bgSprite);

        this.#gems = [];
    }

    /*
    w - количество ячеек по горизонтали
    h - количество ячеек по вертикали
    maxWidth - доступная область в пикселях
    maxHeight - доступная область в пикселях
    */
    setDimensions(w, h, maxWidth, maxHeight) {
        this.#size = {x:w, y:h};
        const horizontal = w / h > maxWidth / maxHeight;
        this.#gemSize = horizontal ? maxWidth / w : maxHeight / h;
        this.#width = this.#gemSize * w;
        this.#height = this.#gemSize * h;
        this.#x = this.#x + (maxWidth - this.#width) / 2;
        this.#y = this.#y;
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
        if (this.#started) {
            throw new Error('Нельзя запустить более одного раза'); 
        }
        if (!this.#gemSize || !this.#width || !this.#height) {
            throw new Error('Перед запуском надо вызвать setDimensions'); 
        }
        this.#started = true;
        this.#bgSprite.beginFill(0xff9800);
        this.#bgSprite.drawRect(0, 0, this.#width, this.#height);
        this.#bgSprite.endFill();

        this.#sprite.x = this.#x;
        this.#sprite.y = this.#y;

        this.#gems = Array(this.#size.x).fill().map(()=>Array(this.#size.y).fill(null));
        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                this.#gems[i][j] = new Cell(i * this.#gemSize, j * this.#gemSize, this.#gemSize);
                this.#sprite.addChild(this.#gems[i][j].getSprite());
            }
        }

        return this;
    }

    getSprite() {
        return this.#sprite;
    }
}