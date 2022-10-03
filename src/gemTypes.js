import { getTexture } from './loader.js';

export const gemColors = {
    blue: Symbol('blue gem'),
    purple: Symbol('purple gem'),
    red: Symbol('red gem'),
    yellow: Symbol('yellow gem'),
    green: Symbol('green gem'),
}

const gemColorInfo = {
    [gemColors.blue]: {
        get texture() { return getTexture('blue')},
    },
    [gemColors.purple]: {
        get texture() { return  getTexture('purple')},
    },
    [gemColors.red]: {
        get texture() { return  getTexture('red')},
    },
    [gemColors.yellow]: {
        get texture() { return  getTexture('yellow')},
    },
    [gemColors.green]: {
        get texture() { return  getTexture('green')},
    }
}

export function readGemColor(color) {
    return gemColorInfo[color];
}