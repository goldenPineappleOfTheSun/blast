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

    animate(delta = 1) {
        this.#progress += (1 / this.#time) * delta;
    }
}