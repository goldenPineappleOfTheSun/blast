import * as PIXI from 'pixi.js'
import { Cell } from './cell.js';

export class GameField {
    #sprite; #x; #y; #width; #height; #gemSize; #rule_minPackSize; #bgSprite; #started; #size;

    /* спрайты камней. не несут логики - только отображение. каждый гем отвечает за отображение одной ячейки 
    (и не падает вниз вместе с камнями, ничего такого, просто следит за одной ячейкой и отрисовывает её состояние) */
    #gems;

    /* состояние игрового поля, важное для игрового процесса (никаких анимаций) */
    #fieldState;

    /* состояние анимаций и прочих мелочей. Так их удобнее тестировать и теперь анимацию можно полностью
    относить к бизнес-логике. Например, падающий камень должен перестать быть падающим и стать настоящим,
    когда он долетит до нижележащего камня - это логика или визуал? */
    #animationState;

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

    /*
    fieldState - состояние игрового поля, важное для игрового процесса (никаких анимаций)
    animationState - состояние анимаций и прочих мелочей. Так их удобнее тестировать и теперь анимацию можно полностью относить к бизнес-логике.
    */
    setStateHolders(fieldState, animationState) {
        this.#fieldState = fieldState;
        this.#animationState = animationState;
        return this;
    }

    /*
    minPackSize - сколько камней должно быть соседями, чтобы их можно было одновременно собрать
    */
    setRules(minPackSize) {
        this.#rule_minPackSize = minPackSize;
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
        if (!this.#fieldState || !this.#animationState) {
            throw new Error('Перед запуском надо вызвать setStateHolders'); 
        }
        if (!this.#rule_minPackSize) {
            throw new Error('Перед запуском надо вызвать setRules'); 
        }
        this.#started = true;
        this.#bgSprite.beginFill(0xff9800);
        this.#bgSprite.drawRect(-20, -20, this.#width + 40, this.#height + 40);
        this.#bgSprite.endFill();

        this.#sprite.x = this.#x;
        this.#sprite.y = this.#y;

        /* кладём камни снизу вверх, чтобы pixi отрисовывал нижние позади верхних */
        this.#gems = Array(this.#size.x).fill().map(()=>Array(this.#size.y).fill(null));
        for (let i=this.#size.x-1; i>=0; i--) {
            for (let j=this.#size.y-1; j>=0; j--) {
                this.#gems[i][j] = new Cell(
                    i * this.#gemSize, j * this.#gemSize, this.#gemSize,
                    this.#fieldState, this.#animationState)
                    .handlerForGetCurrentState(() => this.#fieldState.get(i, j))
                    .handlerForClick(() => alert(this.checkIfPackable(i, j)));
                this.#sprite.addChild(this.#gems[i][j].getSprite());
            }
        }

        return this;
    }

    getSprite() {
        return this.#sprite;
    }

    checkIfPackable(x, y) {
        const state = (x, y) => this.#fieldState.get(x, y);
        if (!state(x, y)) {
            return false;
        }
        let found = 0;
        const color = state(x, y);
        let checked = {x:{y:true}};
        const check = (x, y) => {
            if (checked[x] && checked[x][y]) {
                return;
            }
            if (!checked[x]) {
                checked[x] = {};
            }
            checked[x][y] = true;

            if (state(x, y) === color) {
                found += 1;
                check(x - 1, y);
                check(x + 1, y);
                check(x, y - 1);
                check(x, y + 1);
            }
        }
        check(x, y);

        return found >= this.#rule_minPackSize;        
    }

    animate(delta) {
        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                this.#gems[i][j].animate(delta);
            }
        }
    }
}