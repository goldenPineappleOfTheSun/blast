import * as PIXI from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';
import { ScoreProgressPanel } from './scoreProgressPanel.js';
import { ScoreBonusesPanel } from './scoreBonusesPanel.js';
import { GameField } from './gameField.js';

const app = new PIXI.Application({ width: 1000, height: 707 });
const scoreProgressPanel = new ScoreProgressPanel(0, 0, app.screen.width, progressPanelHeight);
const scoreBonusesPanel = new ScoreBonusesPanel(app.screen.width - bonusesPanelWidth, progressPanelHeight, bonusesPanelWidth, app.screen.height - progressPanelHeight);
const gameField = new GameField(30, progressPanelHeight + 30)
    .setDimensions(1, 5, app.screen.width - bonusesPanelWidth - 60, app.screen.height - progressPanelHeight - 60)
    .start();

app.stage.addChild(scoreProgressPanel.getSprite());
app.stage.addChild(scoreBonusesPanel.getSprite());
app.stage.addChild(gameField.getSprite());

console.log(app)

document.body.appendChild(app.view);