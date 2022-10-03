import { gemColors, readGemColor } from '../gemTypes.js';

test('read gem color info', () => {
    expect(readGemColor(gemColors.blue)).toBeTruthy();
    expect(readGemColor(gemColors.red)).toBeTruthy();
    expect(readGemColor(gemColors.false)).toBeUndefined();
});