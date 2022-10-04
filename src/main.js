import { Application, Texture } from 'pixi.js'
import { onResourcesLoaded, getTexture } from './loader.js';
import { GameField } from './gameField.js';
import { GemsState } from './gemsState.js';
import { AnimationsState } from './animationsState.js';
import { init as initCurtain, showCurtain, hideCurtain } from './curtain.js';
import { init as initParticles, animateParticles } from './particles.js';
import { init as initRules, animate as animateScore } from './scores.js'
import { addPickaxeBonusToGamefield } from './pickaxeBonus.js';
import { addBombBonusToGamefield } from './bombBonus.js';
import { addSwapBonusToGamefield } from './swapBonus.js';

/* в этом месте считываем параметры из адресной строки. Конфиг мог бы быть удобнее, но я хочу выложить на гитхабпейджес, так что вот */
const urlParams = location.search ? location.search.split('?')[1].split('&').reduce((acc, cur) => {
    acc[cur.split('=')[0]] = +cur.split('=')[1];
    return acc;
}, {}) : {};
/*  размер поля */
const cellsCount = {x:(urlParams.width || 8), y:(urlParams.height || 8)};
/* высота верхней панели */
const progressPanelHeight = 85;
/* ширина правой панели */
const bonusesPanelWidth = 456;
/* пространство между панелями и полем */
const gameFieldPadding = 50;

let started = false; 
let paused = false;
let gameField = null;
let state = null;
let animationState = null;

/* содаем пикси-приложение */
const app = new Application({ 
    view: document.querySelector('.main-canvas'), 
    width: 1000, 
    height: 707, 
    transparent: true, 
    backgroundColor: 0x000000 });
document.body.appendChild(app.view);

/* срабатывает, когда loader закончит грузить */
function init() {

    /* устанавливаем правила игры */
    initRules(urlParams.pack || 2, urlParams.moves || 25, urlParams.target || 250, urlParams.shuffles || 10);
    
    /* создаём состояние игрового поля (без анимаций) */
    state = new GemsState(cellsCount.x, cellsCount.y);
    state.fillRandom();

    /* создаём состояние анимаций игрового поля */
    animationState = new AnimationsState()
        .handlerForGetCellState(state.get.bind(state))
        .handlerForPutStaticGem(state.put.bind(state))
        .handlerForGetFieldSize(() => state.size);

    /* создаём игровое поле - контроллер, который ломает камнии начисляет очки */
    /* передаём ему ссылки на хранителей состояния */
    /* передаём ему настройки размеров поля */
    /* затем стартуем игру */
    gameField = new GameField(gameFieldPadding, progressPanelHeight + gameFieldPadding)
        .setStateHolders(state, animationState)
        .setDimensions(
            cellsCount.x, 
            cellsCount.y, 
            app.screen.width - bonusesPanelWidth - gameFieldPadding * 2, 
            app.screen.height - progressPanelHeight - gameFieldPadding * 2)
        .start();

    /* назначаем AnimationsStat'у обработчик для передачи управления в gameField. 
    Вызывается именно тут, потому что нужно инициализированное игровое поле */
    animationState
        .handlerForEndAnimation(gameField.playersTurn.bind(gameField));

    /* добавляет игровому полю бонусы из внешних модулей */
    addPickaxeBonusToGamefield(gameField);
    addBombBonusToGamefield(gameField);
    addSwapBonusToGamefield(gameField);

    /* добавляем спрайты к стейджу */
    app.stage.addChild(gameField.getSprite());
    gameField.getSprite().addChild(animationState.getSprite());
    app.stage.addChild(initParticles());

    /* инициализируем html часть */
    let dom_body = document.querySelector('body');
    if (dom_body) {
        dom_body.classList.add('loaded');
    }
    dom.handlerForPauseClick(() => {
        if (paused) {
            paused = false;
            hideCurtain('pause');
        } else {
            paused = true;
            showCurtain('pause', 'Пауза');
        }
    });
    dom.handlerForBonusSelected((name) => {
        if (name) {
            gameField.useBonus(name);
        } else {
            gameField.disableBonus();
        }
    });
    
    /* отметка, что всё загружено */
    started = true;
}

/* регистрируем событие лоадеру */
onResourcesLoaded(init);

app.ticker.add((delta) => {
    if (!started || paused) {
        return;
    }
    gameField.animate(delta);
    animationState.animate(delta);
    animateParticles(delta);
    animateScore(delta);
});