import { getTexture } from './loader.js';

export const gemTypes = {
    blue: Symbol('blue gem'),
    purple: Symbol('purple gem'),
    red: Symbol('red gem'),
    yellow: Symbol('yellow gem'),
    green: Symbol('green gem'),
}

const gemTypeInfo = {
    [gemTypes.blue]: {
        get texture() { return getTexture('blue')},
    },
    [gemTypes.purple]: {
        get texture() { return  getTexture('purple')},
    },
    [gemTypes.red]: {
        get texture() { return  getTexture('red')},
    },
    [gemTypes.yellow]: {
        get texture() { return  getTexture('yellow')},
    },
    [gemTypes.green]: {
        get texture() { return  getTexture('green')},
    }
}

export function readGemType(type) {
    return gemTypeInfo[type];
} 

export function readGemTexture(type) {
    return gemTypeInfo[type].texture;
} 