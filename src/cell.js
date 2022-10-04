import { Container, Graphics, Sprite } from 'pixi.js'
import { readGemColor } from './gemTypes.js'
import { getFrame } from './loader.js'

export class Cell {
    #sprite; #gemSprite; #size; #position; #x; #y; #getstate; #getanimationstate; #onclick; #onmouseover;

    /*
    x, y - позиция спрайта в пикселях
    size - размер спрайта в пикселях
    fieldState - текущее состояние поля
    animationState - текущее состояние всяких анимаций на поле
    */
    constructor(x, y, size) {
        this.#position = {x, y};
        /* #sprite - рутовый контейнер */
        this.#sprite = new Container();
        this.#sprite.x = x + size / 2;
        this.#sprite.y = y + size / 2;
        this.#sprite.interactive = true;
        /* создаётся много функций, но с другой стороны cell-объекты никогда не удаляются и не пересоздаются, так что ок */
        this.#sprite.on('mouseup', this.click.bind(this));
        this.#sprite.on('mouseover', this.mouseover.bind(this));
        this.#size = size;

        /* #gemSprite - картинка, которую надо нарисовать */
        this.#gemSprite = new Sprite.from('img/red.png');
        this.#gemSprite.anchor.set(0.5);
        this.#sprite.addChild(this.#gemSprite);

        const bounds = getFrame('red');
        /* у картинок камней есть небольшая пристройка сверху, из-за чего высота чуть больше ширины
        поэтому scale считается относительно ширины */
        const xScale = this.#size / bounds.w;
        this.#gemSprite.scale = {x:xScale, y:xScale};
    }

    getSprite() {
        return this.#sprite;
    }

    handlerForGetCurrentState(func) {
        this.#getstate = func;
        return this;
    }

    handlerForGetCurrentAnimationState(func) {
        this.#getanimationstate = func;
        return this;
    }

    handlerForClick(func) {
        this.#onclick = func;
        return this;
    }

    handlerForMouseover(func) {
        this.#onmouseover = func;
        return this;
    }

    click() {
        this.#onclick();
    }

    mouseover() {
        this.#onmouseover();
    }

    animate(delta) {
        if (!this.#getstate) {
            throw new Error("функция для получения состояния не установлена");
        }
        if (!this.#getanimationstate) {
            throw new Error("функция для получения анимации не установлена");
        }

        const state = this.#getstate();
        const astate = this.#getanimationstate().cell;

        /* в клетке пусто */
        if (state === null && astate === null) {
            this.#gemSprite.alpha = 0;
            return;
        } 

        if (state === null && astate !== null) {
            /* в клетке есть падающий или анимированный камень */
            if (astate.animation === 'falling') {
                this.#gemSprite.alpha = 1;
                this.#gemSprite.texture = readGemColor(astate.color).texture;
                this.#gemSprite.y = astate.offset * this.#size;
                this.#gemSprite.rotation = astate.rotation;
                return;
            }
            if (astate.animation === 'swapping') {
                this.#gemSprite.alpha = 1;
                this.#gemSprite.texture = readGemColor(astate.color).texture;
                this.#gemSprite.x = astate.offset.x * this.#size;
                this.#gemSprite.y = astate.offset.y * this.#size;
                return;
            }
        }

        if (state !== null && astate === null) {
            /* в клетке камень */
            this.#gemSprite.alpha = 1;
            this.#gemSprite.y = 0;
            this.#gemSprite.x = 0;
            this.#gemSprite.rotation = 0;
            this.#gemSprite.texture = readGemColor(state).texture;
        }
    }
}