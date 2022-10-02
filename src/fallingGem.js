export class FallingGem {
    #type; #maxvelocity; #acceleration;

    constructor(x, y, type, initAccelerate = 0) {
        this.x = x;
        this.y = y;
        this.#type = type;
        this.#acceleration = 0.004;
        this.#maxvelocity = 0.3;
        this.velocity = initAccelerate;
    }

    get type() {
        return this.#type;
    }

    animate(delta = 1) {
        if (this.velocity < this.#maxvelocity) {
            this.velocity += this.#acceleration * delta;
        }
        this.y += this.velocity * delta;
    }
}