import { gemColors } from './gemTypes.js';
import { randomElement } from './utils.js';

const defaultGemColors = [gemColors.blue, gemColors.red, gemColors.green, gemColors.purple, gemColors.yellow];

/*
текущее состояние поля без учёта анимаций
если клетка = null, то она либо пустая либо, например, пока анимирована
*/
export class GemsState {
    #field; #size; #possibleColors;

    /*
    w - количество ячеек
    h - количество ячеек
    possibleColors - список допустимых типов камней. Используется только рандом-генераторами, 
        т.к. в put кто-то может захотеть ложить даже те камни, которые сами бы никогда не сгенерировались 
        (супертайлы, например)
    */
    constructor(w, h, possibleColors = defaultGemColors) {
        this.#field = Array(w).fill().map(()=>Array(h).fill(null));
        this.#size = {x: w, y: h};
        this.#possibleColors = possibleColors;
    }

    get size() {
        return this.#size;
    }

    get possibleColors() {
        return this.#possibleColors;
    }

    /*
    сообщить тип камня, который должен лежать в координатах x y
    color - берётся из перечисления gemTypes.js
    */
    put(x, y, color) {
        if (x < 0 || y < 0 || x >= this.#field.length || y >= this.#field[0].length) {
            throw new Error('Нельзя положить камень за пределы поля');
        }
        this.#field[x][y] = color;
        return this;
    }

    /*
    убрать камень из этой ячейки (выставить в null)
    */
    clear(x, y) {
        if (x < 0 || y < 0 || x >= this.#field.length || y >= this.#field[0].length) {
            return;
        }
        this.#field[x][y] = null;
        return this;
    }

    /*
    заполняет всё поле случайными камнями из списка допустимых
    */
    fillRandom() {
        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                this.#field[i][j] = this.chooseRandomColor();
            }
        }
        return this;
    }

    /*
    возвращает случайный камень из возможных
    */
    chooseRandomColor() {
        return randomElement(this.#possibleColors);
    }

    /*
    посмотреть, какой камень лежит в координатах x y
    */
    get(x, y) {
        if (x < 0 || y < 0 || x >= this.#field.length || y >= this.#field[0].length) {
            return null;
        }
        return this.#field[x][y];
    }
}