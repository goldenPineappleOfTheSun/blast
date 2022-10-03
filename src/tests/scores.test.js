import { init, getMinPackSize, getMovesLeft, getTargetScore, move } from '../scores.js';

test('sets rules on init', () => {
    init(11, 111, 1111);
    expect(getMinPackSize()).toBe(11);
    expect(getMovesLeft()).toBe(111);
    expect(getTargetScore()).toBe(1111);
});
