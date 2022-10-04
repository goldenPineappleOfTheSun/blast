import { GameField } from './gameField.js';

function highlight(field, x, y) {
    field.highlight([{x, y}]);         
}

function click1(field, x, y) {
    field.setStage('swap-2');
    field.swapData = {};
    field.swapData.origin = {x, y};
}

function click2(field, x, y) {
    field.swap(field.swapData.origin, {x, y});
    field.disableBonus();
}

export function addSwapBonusToGamefield(gameField) {
    gameField.addBonus('swap', {highlight, click: click1});
    gameField.addBonus('swap-2', {highlight, click: click2});
}