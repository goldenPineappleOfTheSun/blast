import { FallingGem } from './fallingGem.js';

export class AnimationsState {
    #field;

    constructor() {
        this.#field = [];
    }

    /* добавить ещё один камень */
    put(gem) {
        const allowedtypes = [FallingGem];
        if (!allowedtypes.some(o => gem instanceof o)) {
            throw new Error("в AnimationsState можно ложить только объекты разрешенных типов");
        }
        this.#field.push(gem);
    }

    /* вызывается в каждом кадре */
    animate() {
        for (let gem of this.#field) {
            gem.animate();
        }

        this.normalize();
    }

    /* борьба с нежелательными состояниями */
    normalize() {
        /* убеждаемся, что падающие камни не наезжают друг на друга */
        //let limit = 1000;
        //let overlapped = true;
        //while (overlapped) {
        //    limit--;
        //    if (limit<0)throw"!";
        //    overlapped = false;
        //    for (let a of this.#field) {
        //        for (let b of this.#field) {
        //            if (Math.abs(a.y - b.y) < 1) {
        //                overlapped = true;
        //                if (a.y > b.y) {
        //                    b.y = a.y - 1;
        //                } else {
        //                    a.y = b.y - 1;
        //                }
        //            }
        //        }
        //    }
        //}
    }

    /* 
    узнать состояние клетки в указанных координатах
    возвращаемое значение имеет формат:
    {
        cell: {
            type: тип(цвет) камня
            offset: насколько вверх он смещён (в клетках, т.е. 0.5 это пол-высоты камня)
        } или null если пусто
    }
    */
    get(x, y) {
        let cell = null;
        for (let gem of this.#field) {
            if (Math.abs(gem.x - x) < 0.1 && gem.y - y <= 0.1 && gem.y - y >= -0.9) {    
                cell = {
                    type: gem.type,
                    offset: gem.y - y
                }
            }
        }

        return {
            cell: cell
        };
    }
}