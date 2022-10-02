import { Container, Graphics, Sprite } from 'pixi.js'
import { readGemTexture } from './gemTypes.js'

export class Cell {
    #sprite; #gemSprite; #size; #position; #x; #y; #state; #astate;

    /*
    position {x, y} - позиция спрайта в пикселях
    coordinates {x, y} - два целых числа, занимаемая клетка на поле
    size - размер спрайта в пикселях
    fieldState - текущее состояние поля
    animationState - текущее состояние всяких анимаций на поле
    */
    constructor(position, coordinates, size, fieldState, animationState) {
        this.#position = position;
        this.#x = coordinates.x;
        this.#y = coordinates.y;
        /* #sprite - рутовый контейнер */
        this.#sprite = new Container();
        this.#sprite.x = position.x + size / 2;
        this.#sprite.y = position.y + size / 2;
        this.#size = size;
        this.#state = fieldState;
        this.#astate = animationState;

        /* #gemSprite - картинка, которую надо нарисовать */
        this.#gemSprite = new Sprite.from('img/red.png');
        this.#gemSprite.anchor.set(0.5);
        this.#gemSprite.scale = {x: 0.5, y: 0.5};
        this.#sprite.addChild(this.#gemSprite);
    }

    getSprite() {
        return this.#sprite;
    }

    animate(delta) {
        const state = this.#state.get(this.#x, this.#y);

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