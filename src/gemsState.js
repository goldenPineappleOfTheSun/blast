/*
текущее состояние поля без учёта анимаций
если клетка = null, то она либо пустая либо, например, пока анимирована
*/
export class GemsState {
    #field; #size;

    /*
    w - количество ячеек
    h - количество ячеек
    */
    constructor(w, h) {
        this.#field = Array(w).fill().map(()=>Array(h).fill(null));
        this.#size = {x: w, y: h};
    }

    get size() {
        return this.#size;
    }

    get(x, y) {
        if (x < 0 || y < 0 || x > this.#field.length || y > this.#field[0].length) {
            return null;
        }
        return this.#field[x][y];
    }
}