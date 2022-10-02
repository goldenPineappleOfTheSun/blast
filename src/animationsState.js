import { FallingGem } from './fallingGem.js';

export class AnimationsState {
    #field; #getstate; #putgem; #getsize; #animationended;

    constructor() {
        this.#field = [];
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
        const allowedtypes = [FallingGem];
        if (!allowedtypes.some(o => gem instanceof o)) {
            throw new Error("в AnimationsState можно ложить только объекты разрешенных типов");
        }
        this.#field.push(gem);
    }

    /* вызывается в каждом кадре */
    animate(delta = 1) {
        /* нормализуем */
        this.normalize();

        /* обновляем */
        for (let gem of this.#field) {
            gem.animate(delta);
        }

        let elementsToDestroy = [];
        /* проверяем, вдруг произошло что-то важное для геймплея */
        for (let a of this.#field) {
            let r = this.#getstate
            let x = a.x;
            let y = (a.y + 1) ^ 0;
            if (this.#getstate(x, y) || this.#getsize().y === y) {
                this.#putgem(x, y - 1, a.type);
                elementsToDestroy.push(a);
            }
        }
        this.#field = this.#field.filter(x => !elementsToDestroy.find(y => x === y));

        if (this.#field.length === 0) {
            this.#animationended();
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