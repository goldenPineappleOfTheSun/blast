import { Container, Graphics, Sprite } from 'pixi.js'
import { readGemTexture } from './gemTypes.js'

export class Cell {
    #sprite; #gemSprite; #size; #position; #x; #y; #getstate; #onclick;

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

    handlerForClick(func) {
        this.#onclick = func;
        return this;
    }

    click() {
        this.#onclick();
    }

    animate(delta) {
        const state = this.#getstate();

        /* в клетке пусто */
        if (state === null) {
            this.#gemSprite.opacity = 0;
            return;
        }

        /* в клетке камень */
        this.#gemSprite.opacity = 1;
        this.#gemSprite.texture = readGemTexture(state);

        let tex = readGemTexture(state);
    }
}