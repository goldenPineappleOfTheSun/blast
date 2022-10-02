import { Application, Texture } from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';
import { onResourcesLoaded, getTexture } from './loader.js';
import { ScoreProgressPanel } from './scoreProgressPanel.js';
import { ScoreBonusesPanel } from './scoreBonusesPanel.js';
import { GameField } from './gameField.js';
import { GemsState } from './gemsState.js';

const cellsCount = {x: 5, y:5};
const gameFieldPadding = 50;

let started = false; 
let gameField = null;
let state = null;

const app = new Application({ width: 1000, height: 707 });

document.body.appendChild(app.view);

function init() {
    const scoreProgressPanel = new ScoreProgressPanel(0, 0, app.screen.width, progressPanelHeight);
    const scoreBonusesPanel = new ScoreBonusesPanel(app.screen.width - bonusesPanelWidth, progressPanelHeight, bonusesPanelWidth, app.screen.height - progressPanelHeight);
    state = new GemsState(cellsCount.x, cellsCount.y);
    state.fillRandom();
    gameField = new GameField(gameFieldPadding, progressPanelHeight + gameFieldPadding)
        .setRules(3)
        .setStateHolders(state, {})
        .setDimensions(
            cellsCount.x, 
            cellsCount.y, 
            app.screen.width - bonusesPanelWidth - gameFieldPadding * 2, 
            app.screen.height - progressPanelHeight - gameFieldPadding * 2)
        .start();

    app.stage.addChild(scoreProgressPanel.getSprite());
    app.stage.addChild(scoreBonusesPanel.getSprite());
    app.stage.addChild(gameField.getSprite());
    
    started = true; 
}

onResourcesLoaded(init);

app.ticker.add((delta) => {
    if (!started) {
        return;
    }

    gameField.animate();
});