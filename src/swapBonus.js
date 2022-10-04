import { Graphics } from 'pixi.js';
import { GameField } from './gameField.js';

/*
Бонус
позволяет выбрать два камня, которые поменяются местами
Использует целых два addBonus. первый для выбора первого камня, второй для выбора второго
Немного расширяет объект игрового поля, чтобы сохранить данные между нажатиями, благо JS позволяет
*/

function highlight(field, x, y) {
    field.highlight([{x, y}]);         
}

function cancel(field) {
    field.swapData.highlight.destroy();
}

function click1(field, x, y) {
    field.setStage('swap-2');
    field.swapData = {};

    let highlight = new Graphics();
    highlight.beginFill(0x00ffff);
    highlight.drawRoundedRect(-field.gemSize * 0.2, -field.gemSize * 0.2, field.gemSize + field.gemSize * 0.4, field.gemSize + field.gemSize * 0.4, field.gemSize * 0.3);
    highlight.endFill();
    highlight.x = x * field.gemSize;
    highlight.y = y * field.gemSize;
    highlight.alpha = 0.5;
    field.getSprite().addChild(highlight);

    field.swapData.origin = {x, y};
    field.swapData.highlight = highlight;
}

function click2(field, x, y) {
    field.swap(field.swapData.origin, {x, y});
    field.swapData.highlight.destroy();
    field.disableBonus();
}

export function addSwapBonusToGamefield(gameField) {
    gameField.addBonus('swap', {highlight, click: click1});
    gameField.addBonus('swap-2', {highlight, click: click2, cancel});
}