import { Graphics, Container, BLEND_MODES } from 'pixi.js';
import { FallingGem } from './fallingGem.js';
import { SwappingGem } from './swappingGem.js';

/*
Один из важнейших компонентов
Хранит в себе инфу об анимациях, происходящих с камнями
Когда анимация закончена, решает, что делать с камнем (в зависимости от типа камня и текущей экспзициии)
По окончанию анимации может, например, превратить анимацию в нормальный игровой камень (в который тыкают)
Когда не осталось анимаций, оповещает об этом gameField (см. animationended)
Умеет подсвечивать камни (см. setHighlightedCells)

На данный момент реализовано 2 вида анимированных камней
Я размышлял над тем, чтобы вынести возможность добавления камней наружу 
(чтобы не приходилось каждый раз менять код прямо в этом модуле), но
пока что мало данных для того как лучше это устроить. Если видов анимаций
вдруг станет больше, то такой рефакторинг можно будет провести
*/

export class AnimationsState {
    #sprite; #field; #getstate; #putgem; #getsize; #animationended; #highlightSprites;

    constructor() {
        this.#sprite = new Container();
        this.#field = [];
        this.#highlightSprites = [];
    }

    getSprite() {
        return this.#sprite;
    }

    /* возвращает количество неоконченных анимаций */
    count() {
        return this.#field.length;
    }

    /* установить обработчик. Функцию (x:int, y:int) => cellState, которая определяет состояние ячейки из gemsState */
    handlerForGetCellState(func) {
        this.#getstate = func;
        return this;
    }

    /* установить обработчик. Функцию (x:int, y:int) => void, которая умеет класть камень в gemsState */
    handlerForPutStaticGem(func) {
        this.#putgem = func;
        return this;
    }

    /* установить обработчик. Функцию () => {x:int, y:int}, которая отдаёт размер поля */
    handlerForGetFieldSize(func) {
        this.#getsize = func;
        return this;
    }

    /* установить обработчик. Функцию () => void, которая вызовется, когда все анимации и падения завершатся */
    handlerForEndAnimation(func) {
        this.#animationended = func;
        return this;
    }

    /* добавить ещё одну анимацию */
    put(gem) {
        const allowedcolors = [FallingGem, SwappingGem];
        if (!allowedcolors.some(o => gem instanceof o)) {
            throw new Error("в AnimationsState можно ложить только объекты разрешенных типов");
        }

        /* следим, чтобы падающие камни не наезжали друг на друга */
        if (gem instanceof FallingGem) {
            for (let other in gem) {
                if (Math.abs(other.x - gem.x) < 0.1 && other.y - gem.y >= 0 && other.y - gem.y < 1) {
                    gem.y -= 1;
                    if (other.velocity < gem.velocity) {
                        gem.velocity = other.velocity;
                    }
                }
            }
        }

        this.#field.push(gem);
    }

    /* указать, какие клетки необходимо подсветить. если [], то нет подсветки */
    setHighlightedCells(arr, cellSize) {
        let index = 0;
        if (!arr || arr.length > 0) {
            while (index < arr.length) {
                if (this.#highlightSprites.length-1 < index) {
                    this.#highlightSprites[index] = new Graphics();
                    this.#highlightSprites[index].beginFill(0xffffff);
                    this.#highlightSprites[index].drawRoundedRect(0, 0, cellSize, cellSize, 5);
                    this.#highlightSprites[index].endFill();
                    this.#highlightSprites[index].alpha = 0.3;
                    this.#highlightSprites[index].blendMode = BLEND_MODES.SCREEN;
                    this.#sprite.addChild(this.#highlightSprites[index]);
                }
                this.#highlightSprites[index].x = arr[index].x;
                this.#highlightSprites[index].y = arr[index].y;
                this.#highlightSprites[index].scale = {x:1, y:1};
                index++;
            }
        }
        for (index=index; index < this.#highlightSprites.length; index++) {
            this.#highlightSprites[index].scale = {x:0, y:0}
        }
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
                    this.#putgem(x, y - 1, a.color);
                    elementsToDestroy.push(a);
                }
                continue;
            }
            if (a instanceof SwappingGem) {
                if (a.progress > 1) {
                    this.#putgem(a.target.x, a.target.y, a.color);
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
    Я выбрал второе
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

    для FallingGem:
    {
        cell: {
            animation: 'falling',
            color: цвет камня "gemColors"
            offset: текущее смещение относительно нижнего края клетки,
            rotation: текущий поворот спрайта,
        }
    }

    для SwappingGem:
    {
        cell: {
            animation: 'swapping',
            color: цвет камня "gemColors"
            offset: текущее смещение спрайта относительно его изначальной клетки
        }
    }
    */
    get(x, y) {
        let cell = null;
        for (let gem of this.#field) {
            if (Math.abs(gem.x - x) < 0.1 && gem.y - y <= 0 && gem.y - y > -1) {    
                if (gem instanceof FallingGem) {
                    cell = {
                        animation: 'falling',
                        color: gem.color,
                        offset: gem.y - y,
                        rotation: gem.rotation,
                    }
                } else if (gem instanceof SwappingGem) {
                    cell = {
                        animation: 'swapping',
                        color: gem.color,
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