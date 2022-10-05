import { Container, Graphics, Sprite } from 'pixi.js'
import { readGemColor } from './gemTypes.js'
import { getFrame } from './loader.js'

/*
Важный модуль

С одной стороны это камень (из которых поле состоит)
Но с другой стороны всё сложнее. На самом деле это клетка на поле
Камней даже теоретически не должно быть больше чем клеток на поле, иначе куда их ставить.
Если их всё же больше, то либо поле должно быть больше, либо новые камни это только объект дизайна
следовательно, достаточно иметь по одному спрайту камня для каждой клетки. Это и есть Cell.js

Можно сказать, что это визуальная часть поля (логическая находится в GemsState и AnimatinsState)
Этот модуль считывает данные о текущем состоянии из GemsState и AnimationsState и решает как именно должен выглядеть 
камень в его клетке. Либо покоится и ждать клика либо лететь где-то выше
*/

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
        this.#sprite.on('touchstart', this.click.bind(this));
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

    /* 
    установить обработчик. Функцию () => GemColors, которая считывает текущее состояние клетки из GemsState 
    то есть Cell будет вызывать эту функцию func() в надежде, что x и y уже сами подставлены и она просто вернёт состояние клетки
    */
    handlerForGetCurrentState(func) {
        this.#getstate = func;
        return this;
    }

    /* 
    установить обработчик. Функцию () => какойто-объект, которая считывает текущее состояние клетки из AnimationsState 
    то есть Cell будет вызывать эту функцию func() в надежде, что x и y уже сами подставлены и она просто вернёт состояние клетки
    */
    handlerForGetCurrentAnimationState(func) {
        this.#getanimationstate = func;
        return this;
    }

    /* установить обработчик. Функцию () => void, будет срабатывать при клике на клетку */
    handlerForClick(func) {
        this.#onclick = func;
        return this;
    }

    /* установить обработчик. Функцию () => void, будет срабатывать при наведении на клетку */
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