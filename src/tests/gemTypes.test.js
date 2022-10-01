import { gemTypes, readGemType } from '../gemTypes.js';

test('read gem type info', () => {
    expect(readGemType(gemTypes.blue)).toBeTruthy();
    expect(readGemType(gemTypes.red)).toBeTruthy();
    expect(readGemType(gemTypes.false)).toBeUndefined();
});