import { Container, Graphics, Sprite } from 'pixi.js'
import { readGemType } from './gemTypes.js'

export class Cell {
    #sprite; #gemSprite; #size; #position; #x; #y; #getstate; #getanimationstate; #onclick;

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
        this.#size = size;

        /* #gemSprite - картинка, которую надо нарисовать */
        this.#gemSprite = new Sprite.from('img/red.png');
        this.#gemSprite.anchor.set(0.5);
        this.#sprite.addChild(this.#gemSprite);

        const bounds = this.#gemSprite.getBounds();
        /* у картинок камней есть небольшая пристройка сверху, из-за чего высота чуть больше ширины
        поэтому scale считается относительно ширины */
        const xScale = this.#size / bounds.width;
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

    click() {
        this.#onclick();
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
            this.#gemSprite.alpha = 1;
            this.#gemSprite.texture = readGemType(astate.type).texture;
            this.#gemSprite.y = astate.offset * this.#size;
        }

        if (state !== null && astate === null) {
            /* в клетке камень */
            this.#gemSprite.alpha = 1;
            this.#gemSprite.y = 0;
            this.#gemSprite.texture = readGemType(state).texture;
        }
    }
}