import { Sprite, Graphics } from 'pixi.js'
import { getTexture, getFrame } from './loader.js';

export class Bubble {
    #tint; #lifetime; #sprite; #destroyed; #direction; #steeringSpeed; #speed; #elevationSpeed;

    constructor(x, y, size, tint) {
        this.#sprite = new Sprite(getTexture('bubble'));
        const bounds = getFrame('bubble');
        this.#sprite.x = x;
        this.#sprite.y = y;
        this.#sprite.alpha = 0.5;
        this.#sprite.anchor.set(0.5);
        let scale = 0.5 + Math.random() * 0.5;
        this.#sprite.scale = {x: size / bounds.w * scale, y: size / bounds.w * scale};
        this.size = size;
        this.#tint = tint;
        this.#direction = Math.random() * Math.PI * 2;
        this.#steeringSpeed = -0.01 + Math.random() * 0.02;
        this.#speed = 5 + Math.random() * 5;
        this.#elevationSpeed = 0;
        this.#lifetime = Math.random() < 0.1 ? 80 + Math.random() * 60 : 20 + Math.random() * 60;
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
        this.#sprite.x += Math.sin(this.#direction) * this.#speed * delta;
        this.#sprite.y += Math.cos(this.#direction) * this.#speed * delta;
        this.#sprite.y -= this.#elevationSpeed;
        this.#direction += this.#steeringSpeed;
        this.#lifetime -= delta;
        this.#speed *= 0.9;
        this.#elevationSpeed += 0.02;
        if (this.#lifetime < 0) {
            this.destroy();
        }
    }
}