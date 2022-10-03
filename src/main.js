import { Application, Texture } from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';
import { onResourcesLoaded, getTexture } from './loader.js';
import { ScoreProgressPanel } from './scoreProgressPanel.js';
import { ScoreBonusesPanel } from './scoreBonusesPanel.js';
import { GameField } from './gameField.js';
import { GemsState } from './gemsState.js';
import { AnimationsState } from './animationsState.js';
import { init as initCurtain } from './curtain.js';
import { init as initParticles, animateParticles } from './particles.js';
import { init as initRules, animate as animateScore } from './scores.js'

const cellsCount = {x:8, y:8};
const gameFieldPadding = 50;

let started = false; 
let gameField = null;
let state = null;
let animationState = null;

const app = new Application({ 
    view: document.querySelector('.main-canvas'), 
    width: 1000, 
    height: 707, 
    transparent: true, 
    backgroundColor: 0x000000 });

document.body.appendChild(app.view);

function init() {
    const scoreProgressPanel = new ScoreProgressPanel(0, 0, app.screen.width, progressPanelHeight);
    const scoreBonusesPanel = new ScoreBonusesPanel(app.screen.width - bonusesPanelWidth, progressPanelHeight, bonusesPanelWidth, app.screen.height - progressPanelHeight);
    state = new GemsState(cellsCount.x, cellsCount.y);
    state.fillRandom();
    animationState = new AnimationsState()
        .handlerForGetCellState(state.get.bind(state))
        .handlerForPutStaticGem(state.put.bind(state))
        .handlerForGetFieldSize(() => state.size);
    gameField = new GameField(gameFieldPadding, progressPanelHeight + gameFieldPadding)
        .setStateHolders(state, animationState)
        .setDimensions(
            cellsCount.x, 
            cellsCount.y, 
            app.screen.width - bonusesPanelWidth - gameFieldPadding * 2, 
            app.screen.height - progressPanelHeight - gameFieldPadding * 2)
        .start();
    animationState
        .handlerForEndAnimation(gameField.playersTurn.bind(gameField));

    app.stage.addChild(scoreProgressPanel.getSprite());
    app.stage.addChild(scoreBonusesPanel.getSprite());
    app.stage.addChild(gameField.getSprite());
    gameField.getSprite().addChild(animationState.getSprite());

    app.stage.addChild(initCurtain('shuffle-anouncer', app.screen.width, app.screen.height));
    app.stage.addChild(initParticles());
    initRules(2, 25, 1500);

    let dom_body = document.querySelector('body');
    if (dom_body) {
        dom_body.classList.add('loaded');
    }
    
    started = true;
}

onResourcesLoaded(init);

app.ticker.add((delta) => {
    if (!started) {
        return;
    }

    gameField.animate(delta);
    animationState.animate(delta);
    animateParticles(delta);
    animateScore(delta);
});