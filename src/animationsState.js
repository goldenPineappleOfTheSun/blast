import { FallingGem } from './fallingGem.js';
import { SwappingGem } from './swappingGem.js';

export class AnimationsState {
    #field; #getstate; #putgem; #getsize; #animationended;

    constructor() {
        this.#field = [];
    }

    count() {
        return this.#field.length;
    }

    /* указать функцию (x:int, y:int) => cellState, которая определяет состояние ячейки из gemsState */
    handlerForGetCellState(func) {
        this.#getstate = func;
        return this;
    }

    /* указать функцию (x:int, y:int) => void, которая умеет класть камень в gemsState */
    handlerForPutStaticGem(func) {
        this.#putgem = func;
        return this;
    }

    /* указать функцию () => {x:int, y:int}, которая отдаёт размер поля */
    handlerForGetFieldSize(func) {
        this.#getsize = func;
        return this;
    }

    /* указать функцию () => void, которая вызовется, когда все анимации и падения завершатся */
    handlerForEndAnimation(func) {
        this.#animationended = func;
        return this;
    }

    /* добавить ещё один камень */
    put(gem) {
        const allowedtypes = [FallingGem, SwappingGem];
        if (!allowedtypes.some(o => gem instanceof o)) {
            throw new Error("в AnimationsState можно ложить только объекты разрешенных типов");
        }
        this.#field.push(gem);
    }

    /* вызывается в каждом кадре */
    animate(delta = 1) {
        if (this.#field.length === 0) {
            return;
        }

        /* обновляем */
        for (let gem of this.#field) {
            gem.animate(delta);
        }

        let elementsToDestroy = [];
        /* проверяем, вдруг произошло что-то важное для геймплея */
        for (let a of this.#field) {
            if (a instanceof FallingGem) {
                let r = this.#getstate
                let x = a.x;
                let y = (a.y + 1) ^ 0;
                if (this.#getstate(x, y) || this.#getsize().y === y) {
                    this.#putgem(x, y - 1, a.type);
                    elementsToDestroy.push(a);
                }
                continue;
            }
            if (a instanceof SwappingGem) {
                if (a.progress > 1) {
                    this.#putgem(a.target.x, a.target.y, a.type);
                    elementsToDestroy.push(a);
                }
                continue;
            }
        }
        this.#field = this.#field.filter(x => !elementsToDestroy.find(y => x === y));

        if (this.#field.length === 0) {
            this.#animationended();
        }

        /* нормализуем */
        this.normalize();
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
        /* #1 убеждаемся, что падающие камни не наезжают друг на друга */

        if (this.#field.length===0) {
            return
        }

        let columns = []

        for (let gem of this.#field) {
            if (!columns[gem.x]) {
                columns[gem.x] = []
            }
            columns[gem.x].push(gem);
        }

        for (let col of columns) {
            if (col) {
                col.sort((a, b) => a.y > b.y ? -1 : a.y < b.y ? 1 : 0)
            }
        }

        for (let col of columns) {
            if (!col) {
                continue;
            }
            let lastY = Infinity;
            let lastVel = 0;
            for (let gem of col) {
                if (lastY - gem.y < 1) {
                    gem.y = lastY - 1;
                    gem.velocity = Math.min(gem.velocity, lastVel);
                }
                lastY = gem.y;
                lastVel = gem.velocity;
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
                if (gem instanceof FallingGem) {
                    cell = {
                        animation: 'falling',
                        type: gem.type,
                        offset: gem.y - y,
                        rotation: gem.rotation,
                    }
                } else if (gem instanceof SwappingGem) {
                    cell = {
                        animation: 'swapping',
                        type: gem.type,
                        offset: gem.offset,
                    }
                }
            }
        }

        return {
            cell: cell
        };
    }
}