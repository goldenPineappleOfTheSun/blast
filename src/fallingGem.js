export class FallingGem {
    #color; #maxvelocity; #acceleration;

    constructor(x, y, color, initAccelerate = 0) {
        this.x = x;
        this.y = y;
        this.#color = color;
        this.#acceleration = 0.006;
        this.#maxvelocity = 0.3;
        this.velocity = initAccelerate;
        this.rotationSpeed = -0.005 + Math.random() * 0.01;
        this.rotation = 0;
    }

    get color() {
        return this.#color;
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