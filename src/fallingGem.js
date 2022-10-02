export class FallingGem {
    #type; #velocity; #maxvelocity; #acceleration;

    constructor(x, y, type, initAccelerate = 0) {
        this.x = x;
        this.y = y;
        this.#type = type;
        this.#acceleration = 0.003;
        this.#maxvelocity = 0.2;
        this.#velocity = initAccelerate;
    }

    get type() {
        return this.#type;
    }

    animate() {
        if (this.#velocity < this.#maxvelocity) {
            this.#velocity += this.#acceleration;
        }
        this.y += this.#velocity;
    }
}