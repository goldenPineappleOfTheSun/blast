import * as PIXI from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';
import { ScoreProgressPanel } from './scoreProgressPanel.js';
import { ScoreBonusesPanel } from './scoreBonusesPanel.js';

const app = new PIXI.Application({ width: 1000, height: 707 });
const scoreProgressPanel = new ScoreProgressPanel(0, 0, app.screen.width, progressPanelHeight);
const scoreBonusesPanel = new ScoreBonusesPanel(app.screen.width - bonusesPanelWidth, progressPanelHeight, bonusesPanelWidth, app.screen.height - progressPanelHeight);

app.stage.addChild(scoreProgressPanel.getSprite());
app.stage.addChild(scoreBonusesPanel.getSprite());

console.log(app)

document.body.appendChild(app.view);