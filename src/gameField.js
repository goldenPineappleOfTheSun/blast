import { Container, Graphics } from 'pixi.js'
import { Cell } from './cell.js';
import { FallingGem } from './fallingGem.js';
import { SwappingGem } from './swappingGem.js';
import { Bubble } from './bubble.js';
import { ScoreFloating } from './scoreFloating.js';
import { dice, sleep } from './utils.js';
import { showCurtain, hideCurtain } from './curtain.js';
import { createParticle } from './particles.js';
import { getMinPackSize as packSize, getMovesLeft, getTargetScore, getScore, move as minusMove, addScore, getMaxConsequentShuffles } from './scores.js';
import { readGemColor } from './gemTypes.js';

const stages = {
    notStarted: 0,
    clickable: 1,
    animation: 2,
    swapping: 3,
    win: 4,
    defeat: 5
}

export class GameField {
    #sprite; #x; #y; #width; #height; #gemSize; #maskSprite; #stage; #size; #consequentShuffles;

    /* спрайты камней. не несут логики - только отображение. каждый гем отвечает за отображение одной ячейки 
    (и не падает вниз вместе с камнями, ничего такого, просто следит за одной ячейкой и отрисовывает её состояние) */
    #gems;

    /* состояние игрового поля, важное для игрового процесса (никаких анимаций) */
    #fieldState;

    /* состояние анимаций и прочих мелочей. Так их удобнее тестировать и теперь анимацию можно полностью
    относить к бизнес-логике. Например, падающий камень должен перестать быть падающим и стать настоящим,
    когда он долетит до нижележащего камня - это логика или визуал? */
    #animationState;

    /*
    x - позиция в пикселях
    y - позиция в пикселях
    */
    constructor(x, y) {
        this.#sprite = new Container();
        this.#x = x;
        this.#y = y;
        this.#width = 0;
        this.#height = 0;
        this.#gemSize = 0;
        this.#stage = stages.notStarted;
        this.#consequentShuffles = 0;

        this.#maskSprite = new Graphics();
        this.#sprite.addChild(this.#maskSprite);
        this.#sprite.mask = this.#maskSprite;

        this.#gems = [];
    }

    /*
    w - количество ячеек по горизонтали
    h - количество ячеек по вертикали
    maxWidth - доступная область в пикселях
    maxHeight - доступная область в пикселях
    */
    setDimensions(w, h, maxWidth, maxHeight) {
        this.#size = {x:w, y:h};
        const horizontal = w / h > maxWidth / maxHeight;
        this.#gemSize = horizontal ? maxWidth / w : maxHeight / h;
        this.#width = this.#gemSize * w;
        this.#height = this.#gemSize * h;
        this.#x = this.#x + (maxWidth - this.#width) / 2;
        this.#y = this.#y;

        let dom_fieldBg = document.querySelector('.field');
        if (dom_fieldBg) {
            dom_fieldBg.style.left = `${this.#x - 30}px`;
            dom_fieldBg.style.top = `${this.#y - 30}px`;
            dom_fieldBg.style.width = `${this.#width + 60}px`;
            dom_fieldBg.style.height = `${this.#height + 60}px`;
        }

        let dom_container = document.querySelector('.container-below');
        let dom_canvas = document.querySelector('canvas');
        if (dom_container && dom_canvas) {
            const bounds = dom_canvas.getBoundingClientRect();
            dom_container.style.width = `${bounds.width}px`;
        }

        dom_container = document.querySelector('.container-above');
        if (dom_container && dom_canvas) {
            const bounds = dom_canvas.getBoundingClientRect();
            dom_container.style.width = `${bounds.width}px`;
        }

        return this;
    }

    /*
    fieldState - состояние игрового поля, важное для игрового процесса (никаких анимаций)
    animationState - состояние анимаций и прочих мелочей. Так их удобнее тестировать и теперь анимацию можно полностью относить к бизнес-логике.
    */
    setStateHolders(fieldState, animationState) {
        this.#fieldState = fieldState;
        this.#animationState = animationState;
        return this;
    }

    get gemSize() {
        return this.#gemSize;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    get position() {
        return {x: this.#x, y:this.#y};
    }

    /*
    разрешить игроку тыкать (фактически начать игру)
    */
    start() {
        if (this.#stage !== stages.notStarted) {
            throw new Error('Нельзя запустить более одного раза'); 
        }
        if (!this.#gemSize || !this.#width || !this.#height) {
            throw new Error('Перед запуском надо вызвать setDimensions'); 
        }
        if (!this.#fieldState || !this.#animationState) {
            throw new Error('Перед запуском надо вызвать setStateHolders'); 
        }
        this.#stage = stages.clickable;

        this.#maskSprite.beginFill(0xff9800);
        this.#maskSprite.drawRect(-20, -20, this.#width + 40, this.#height + 40);
        this.#maskSprite.endFill();

        this.#sprite.x = this.#x;
        this.#sprite.y = this.#y;

        /* кладём камни снизу вверх, чтобы pixi отрисовывал нижние позади верхних */
        /* счёт по y начинается с -1, так как визуально кубики могут быть выше экрана (например новые) 
        их тоже надо нарисовать */
        this.#gems = Array(this.#size.x).fill().map(()=>Array(this.#size.y).fill(null));
        for (let i=this.#size.x-1; i>=0; i--) {
            for (let j=this.#size.y-1; j>=-1; j--) {
                this.#gems[i][j] = new Cell(
                    i * this.#gemSize, j * this.#gemSize, this.#gemSize,
                    this.#fieldState, this.#animationState)
                    .handlerForGetCurrentState(() => this.#fieldState.get(i, j))
                    .handlerForGetCurrentAnimationState(() => this.#animationState.get(i, j))
                    .handlerForClick(() => this.click(i, j))
                    .handlerForMouseover(() => this.mouseover(i, j));
                this.#sprite.addChild(this.#gems[i][j].getSprite());
            }
        }

        this.#sprite.interactive = true;
        this.#sprite.on('mouseout', () => this.cancelHighlighting());

        this.shuffleIfNeeded();

        return this;
    }

    getSprite() {
        return this.#sprite;
    }

    async click(x, y) {
        if (this.#stage !== stages.clickable) {
            return; 
        }

        let check = this.checkIfPackable(x, y);
        if (!check) {
            return;
        }

        check = check.map(o => {return {color: this.#fieldState.get(o.x, o.y), ...o}});

        this.#stage = stages.animation;
        this.cancelHighlighting();
        minusMove();

        for (let f of check) {
            this.#fieldState.clear(f.x, f.y);
            for (let i=0; i<3; i++) {
                createParticle(new Bubble(
                    this.#x + f.x * this.#gemSize + this.#gemSize * 0.2 + Math.random() * this.#gemSize * 0.6, 
                    this.#y + f.y * this.#gemSize + this.#gemSize * 0.2 + Math.random() * this.#gemSize * 0.6, 
                    this.#gemSize));
            }
        }

        /* подкидываем новые блоки сверху */
        for (let i=0; i<this.#size.x; i++) {
            let count = 0;
            for (let j=0; j<this.#size.y; j++) {
                if (this.#fieldState.get(i, j) === null) {
                    count++;
                }
            }
            for (let j=1; j<=count; j++) {
                this.#animationState.put(new FallingGem(i, -j - 1, this.#fieldState.chooseRandomColor(), -0.05));
            }
        }

        /* роняем блоки, которые зависли в воздухе */
        for (let i=0; i<this.#size.x; i++) {
            let inAir = false;
            for (let j=this.#size.y-1; j>=0; j--) {
                if (this.#fieldState.get(i, j) === null) {
                    inAir = true;
                    continue;
                }
                if (inAir) {
                    const initVelocity = -0.06 + Math.random() * 0.03;
                    this.#animationState.put(new FallingGem(i, j, this.#fieldState.get(i, j), initVelocity));
                    this.#fieldState.clear(i, j);
                }
            }
        }

        let index = 1;
        for (let c of check) {
            await sleep(100 - index * 3);
            createParticle(new ScoreFloating(
                this.#x + c.x * this.#gemSize + this.#gemSize / 2,
                this.#y + c.y * this.#gemSize + this.#gemSize / 2, 
                this.#gemSize/2, index, readGemColor(c.color).tint));
            addScore(+index);
            index++;
        }
    }

    async mouseover(x, y) {
        const check = this.checkIfPackable(x, y);
        if (!check) {
            this.#animationState.setHighlightedCells([], 0);
            return;
        }
        this.#animationState.setHighlightedCells(
            check.map(o => {return {x:o.x*this.#gemSize + this.#gemSize*0.05, y:o.y*this.#gemSize+this.#gemSize*0.05}}), 
            this.#gemSize*0.9);
    }

    async cancelHighlighting() {
        this.#animationState.setHighlightedCells([], 0);
    }

    /*
    меняет местами два камня
    a {x, y} - координаты первого камня
    b {x, y} - координаты второго камня
    */
    swap(a, b) {
        if (this.#stage !== stages.clickable && this.#stage !== stages.swapping) {
            return;
        }
        this.#stage = stages.swapping;
        this.#animationState.put(new SwappingGem(a, b, this.#fieldState.get(a.x, a.y)));
        this.#animationState.put(new SwappingGem(b, a, this.#fieldState.get(b.x, b.y)));
        this.#fieldState.clear(a.x, a.y);
        this.#fieldState.clear(b.x, b.y);
    }

    /*
    проверяет, есть ли на поле возможные ходы, если нет, то перемешивает камни
    */
    async shuffleIfNeeded() {
        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                if (this.checkIfPackable(i, j)) {
                    this.#consequentShuffles = 0;
                    return;
                }
            }
        }

        if (this.#consequentShuffles >= getMaxConsequentShuffles()) {
            this.#stage = stages.defeat;
            showCurtain('defeat', `Поражение!</div><div style="font-size: 13px;">слишком много неудачных перетасовок</div><img src="img/sad-dolphin.png" style="filter: blur(3px);width:100px"><img src="img/sad-dolphin.png" style="position: absolute;bottom: 0;width:100px;">`)
            dom.defeat();
            return;
        }

        this.#consequentShuffles++;

        await sleep(300);
        showCurtain('shuffle-anouncer', 'Нет ходов...\nПеремешиваем!');
        await sleep(1000);
        hideCurtain('shuffle-anouncer');
        await sleep(500);

        let occupied = Array(this.#size.x).fill().map(()=>Array(this.#size.y).fill(null));

        for (let i=0; i<this.#size.x; i++) {
            for (let j=0; j<this.#size.y; j++) {
                let x = dice(this.#size.x);
                let y = dice(this.#size.y);
                while (occupied[x][y]) {
                    x = dice(this.#size.x);
                    y = dice(this.#size.y);
                }
                occupied[x][y] = {x:i, y:j, color: this.#fieldState.get(i, j)};
            }
        }

        for (let x=0; x<this.#size.x; x++) {
            for (let y=0; y<this.#size.y; y++) {
                const target = occupied[x][y];
                this.#animationState.put(new SwappingGem({x, y}, target, this.#fieldState.get(x, y), 30));
                this.#fieldState.clear(x, y);
            }
        }
    }

    /* все анимации закончились и снова можно тыкать */
    playersTurn() {
        if (getMovesLeft() <= 0) {
            this.#stage = stages.defeat;
            showCurtain('defeat', `Поражение!</div><div style="font-size: 13px;">ходы закончились</div><img src="img/sad-dolphin.png" style="filter: blur(3px);width:100px"><img src="img/sad-dolphin.png" style="position: absolute;bottom: 0;width:100px;">`)
            dom.defeat();
            return;
        }
        if (getTargetScore() <= getScore()) {
            this.#stage = stages.win;
            showCurtain('win', 'победа!');
            dom.win();
            return;
        }
        this.shuffleIfNeeded();
        this.#stage = stages.clickable;
    }

    checkIfPackable(x, y) {
        const state = (x, y) => this.#fieldState.get(x, y);
        if (!state(x, y)) {
            return false;
        }
        let found = [];
        const color = state(x, y);
        let checked = {x:{y:true}};
        const check = (x, y) => {
            if (checked[x] && checked[x][y]) {
                return;
            }
            if (!checked[x]) {
                checked[x] = {};
            }
            checked[x][y] = true;

            if (state(x, y) === color) {
                found.push({x, y});
                check(x - 1, y);
                check(x + 1, y);
                check(x, y - 1);
                check(x, y + 1);
            }
        }
        check(x, y);

        return found.length >= packSize() ? found : false;        
    }

    animate(delta) {
        for (let i=0; i<this.#size.x; i++) {
            for (let j=-1; j<this.#size.y; j++) {
                this.#gems[i][j].animate(delta);
            }
        }
    }
}