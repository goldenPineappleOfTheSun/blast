import { Container, Text } from 'pixi.js'

export class ScoreFloating {
    #sprite; #tint; #destroyed; #xspeed; #yspeed; #disappearingSpeed;

    constructor(x, y, size, n, color) {
        this.#sprite = new Text(`+${n}`, {
            fontFamily : 'marvin',
            fontSize: size + n * 2,
            fill : color,
            align : 'center',
            stroke: 0x001e3b,
            lineJoin: "round",
            strokeThickness: 3,
        });
        this.#sprite.x = x;
        this.#sprite.y = y;
        this.#xspeed = -1 + Math.random() * 2;
        this.#yspeed = -5 + Math.random() * -3;
        this.#disappearingSpeed = 0.01 + Math.random() * 0.01;
        this.#destroyed = false;
    }

    getSprite() {
        return this.#sprite;
    }

    destroy() {
        this.#destroyed = true;
    }

    isDestroyed() {
        return this.#destroyed;
    }

    animate(delta) {
        this.#sprite.x += this.#xspeed * delta;
        this.#sprite.y += this.#yspeed * delta;
        this.#yspeed *= (1 - 0.1 * delta);
        this.#xspeed *= (1 - 0.05 * delta);
        this.#sprite.alpha -= this.#disappearingSpeed * delta;
        if (this.#sprite.alpha <= 0) {
            this.destroy();
        }
    }
}