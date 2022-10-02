import { gemTypes } from './gemTypes.js';
import { randomElement } from './utils.js';

const defaultGemTypes = [gemTypes.blue, gemTypes.red, gemTypes.green];

/*
текущее состояние поля без учёта анимаций
если клетка = null, то она либо пустая либо, например, пока анимирована
*/
export class GemsState {
    #field; #size; #possibleTypes;

    /*
    w - количество ячеек
    h - количество ячеек
    possibleTypes - список допустимых типов камней. Используется только рандом-генераторами, 
        т.к. в put кто-то может захотеть ложить даже те камни, которые сами бы никогда не сгенерировались 
        (супертайлы, например)
    */
    constructor(w, h, possibleTypes = defaultGemTypes) {
        this.#field = Array(w).fill().map(()=>Array(h).fill(null));
        this.#size = {x: w, y: h};
        this.#possibleTypes = possibleTypes;
    }

    get size() {
        return this.#size;
    }

    get possibleTypes() {
        return this.#possibleTypes;
    }

    /*
    сообщить тип камня, который должен лежать в координатах x y
    type - берётся из перечисления gemTypes
    */
    put(x, y, type) {
        if (x < 0 || y < 0 || x > this.#field.length || y > this.#field[0].length) {
            throw new Error('Нельзя положить камень за пределы поля');
        }
        this.#field[x][y] = type;
    }

    /*
    заполняет всё поле случайными камнями из списка допустимых
    */
    fillRandom() {
        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                this.#field[i][j] = randomElement(this.#possibleTypes);
            }
        }
    }

    /*
    посмотреть, какой камень лежит в координатах x y
    */
    get(x, y) {
        if (x < 0 || y < 0 || x > this.#field.length || y > this.#field[0].length) {
            return null;
        }
        return this.#field[x][y];
    }
}