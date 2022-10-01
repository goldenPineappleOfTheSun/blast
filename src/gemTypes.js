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
        texture: getTexture('blue')
    },
    [gemTypes.red]: {
        texture: getTexture('red')
    }
}

export function readGemType(type) {
    return gemTypeInfo[type];
} 