import { getTexture } from './loader.js';

/* 
хранит типы (цвета) камней
если спросить подробности о цвете, то расскажет
*/

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
        tint: 0x04bcfd
    },
    [gemColors.purple]: {
        get texture() { return  getTexture('purple')},
        tint: 0xaf59a0
    },
    [gemColors.red]: {
        get texture() { return  getTexture('red')},
        tint: 0xff4666
    },
    [gemColors.yellow]: {
        get texture() { return  getTexture('yellow')},
        tint: 0xdcb348
    },
    [gemColors.green]: {
        get texture() { return  getTexture('green')},
        tint: 0xa5df70
    }
}

export function readGemColor(color) {
    return gemColorInfo[color];
}