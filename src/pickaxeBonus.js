import { GameField } from './gameField.js';

function highlight(field, x, y) {
    field.highlight([{x, y}]);         
}

function click(field, x, y) {
    field.destroyGem(x, y);
    field.fall();
    field.disableBonus();
}

export function addPickaxeBonusToGamefield(gameField) {
    gameField.addBonus('pickaxe', {highlight, click});
}