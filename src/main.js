import * as PIXI from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';
import { ScoreProgressPanel } from './scoreProgressPanel.js';
import { ScoreBonusesPanel } from './scoreBonusesPanel.js';
import { GameField } from './gameField.js';
import { GemsState } from './gemsState.js';

const cellsCount = {x: 5, y:5};
const gameFieldPadding = 30;

const loader = new PIXI.Loader(); 

loader.add('spritesheet', 'images/spritesheet.json');
loader.load(spritesheetLoaded);

const app = new PIXI.Application({ width: 1000, height: 707 });

document.body.appendChild(app.view);

function spritesheetLoaded() {
    const scoreProgressPanel = new ScoreProgressPanel(0, 0, app.screen.width, progressPanelHeight);
    const scoreBonusesPanel = new ScoreBonusesPanel(app.screen.width - bonusesPanelWidth, progressPanelHeight, bonusesPanelWidth, app.screen.height - progressPanelHeight);
    const gameField = new GameField(gameFieldPadding, progressPanelHeight + gameFieldPadding)
        .setDimensions(
            cellsCount.x, 
            cellsCount.y, 
            app.screen.width - bonusesPanelWidth - gameFieldPadding * 2, 
            app.screen.height - progressPanelHeight - 60)
        .start();
    const state = new GemsState(cellsCount.x, cellsCount.y);

    app.stage.addChild(scoreProgressPanel.getSprite());
    app.stage.addChild(scoreBonusesPanel.getSprite());
    app.stage.addChild(gameField.getSprite());
}