import * as PIXI from 'pixi.js'
import { progressPanelHeight, bonusesPanelWidth } from './config.js';

const app = new PIXI.Application({ width: 1000, height: 707 });

document.body.appendChild(app.view);