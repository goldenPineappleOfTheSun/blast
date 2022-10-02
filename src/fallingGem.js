export class FallingGem {
    #type;

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.#type = type;
    }

    get type() {
        return this.#type;
    }

    animate() {
        this.y += 0.01;
    }
}