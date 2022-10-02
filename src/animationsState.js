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
    animate(delta = 1) {
        this.normalize();
        for (let gem of this.#field) {
            gem.animate(delta);
        }
    }

    /* 
    борьба с нежелательными состояниями 
    разделениt визуальной части (Cell) и логики (GemsState & AnimationsState)
    привела меня к сложностям, к тому что Cell может справиться не с каждым состоянием,
    которое предлагает ему AnimationsState
    Так что либо делаем Cell и AnimationsState.get() более универсальным, либо просим AnimationsState быть вежливее
    я выбрал второе
    */
    normalize() {
        /* убеждаемся, что падающие камни не наезжают друг на друга */
        let limit = 100;
        let overlapped = true;
        while (overlapped) {
            limit--;
            if (limit < 0) {
                console.warn("normalize не смогла навести порядок");
                return;
            }
            overlapped = false;
            for (let i=0; i<this.#field.length; i++) {
                for (let j=i+1; j<this.#field.length; j++) {
                    let a = this.#field[i]; 
                    let b = this.#field[j]; 
                    if (Math.abs(a.x - b.x) < 0.1 && Math.abs(a.y - b.y) < 1) {
                        overlapped = true;
                        if (a.y > b.y) {
                            b.y = a.y - 1;
                            b.velocity = Math.min(a.velocity, b.velocity);
                        } else {
                            a.y = b.y - 1;
                            a.velocity = Math.min(a.velocity, b.velocity);
                        }
                    }
                }
            }
        }
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
            if (Math.abs(gem.x - x) < 0.1 && gem.y - y <= 0 && gem.y - y > -1) {    
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