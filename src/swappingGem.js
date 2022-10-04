/*
Анимация для AnimationState
Выглядят как обычные игровые камни
Визуально вылетают из точки А и летят в точку Б, где и ппропадают
Фактически x и y не меняются, а сдвигается только спрайт, это нужно, чтобы AnimationState их не терял
*/

export function registerGemAnimation(animationState) {
    animationState.addAnimationType(SwappingGem);
}

export class SwappingGem {
    #origin; #target; #time; #progress; #color; #dx; #dy;

    constructor(a, b, color, time=10) {
        this.x = a.x;
        this.y = a.y;
        this.#origin = a;
        this.#target = b;
        this.#color = color;
        this.#time = time;
        this.#progress = 0;
        this.#dx = b.x - a.x;
        this.#dy = b.y - a.y;
    }

    get color() {
        return this.#color;
    }

    get origin() {
        return this.#origin;
    }

    get target() {
        return this.#target;
    }

    get progress() {
        return this.#progress;
    }

    get offset() {
        return {
            x: this.#dx * this.#progress,
            y: this.#dy * this.#progress,
        };
    }

    tryExit(animationState, field, functions) {
        if (this.progress > 1) {
            functions.putGem(this.target.x, this.target.y, this.color);
            functions.destroy();
        }
    }

    getData(animationState, x, y) {
        return {
            animation: 'swapping',
            color: this.color,
            offset: this.offset,
        }
    }

    animate(delta = 1) {
        this.#progress += (1 / this.#time) * delta;
    }
}