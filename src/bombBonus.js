import { GameField } from './gameField.js';

function highlight(field, x, y) {
    let cells = [];
    for (let i=x-1; i<=x+1; i++) {
        for (let j=y-1; j<=y+1; j++) {
            cells.push({x:i, y:j});
        }
    }
    field.highlight(cells);         
}

function click(field, x, y) {
    for (let i=x-1; i<=x+1; i++) {
        for (let j=y-1; j<=y+1; j++) {
            field.destroyGem(i, j);
        }
    }
    field.fall();
    field.disableBonus();
}

export function addBombBonusToGamefield(gameField) {
    gameField.addBonus('bomb', {highlight, click});
}