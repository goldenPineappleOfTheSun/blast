/*
Анимация для AnimationState
Выглядят как обычные, но падающие вниз игровые камни
*/

export function registerGemAnimation(animationState) {
    animationState.addAnimationType(FallingGem);
}

export class FallingGem {
    #color; #maxvelocity; #acceleration;

    constructor(x, y, color, initAccelerate = 0) {
        this.x = x;
        this.y = y;
        this.#color = color;
        this.#acceleration = 0.006;
        this.#maxvelocity = 0.3;
        this.velocity = initAccelerate;
        this.rotationSpeed = -0.01 + Math.random() * 0.02;
        this.rotation = 0;
    }

    get color() {
        return this.#color;
    }

    tryExit(animationState, field, functions) {
        let x = this.x;
        let y = (this.y + 1) ^ 0;
        if (functions.getState(x, y) || functions.getFieldSize().y === y) {
            functions.putGem(x, y - 1, this.color);
            functions.destroy();
        }
    }

    getData(animationState, x, y) {
        return {
            animation: 'falling',
            color: this.color,
            offset: this.y - y,
            rotation: this.rotation,
        }
    }

    animate(delta = 1) {
        if (this.velocity < this.#maxvelocity) {
            this.velocity += this.#acceleration * delta;
        }
        this.y += this.velocity * delta;
        this.rotation += this.rotationSpeed;
        this.rotationSpeed *= 0.95;
    }
}