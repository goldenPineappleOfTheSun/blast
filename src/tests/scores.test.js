import { init, getMinPackSize, getMovesLeft, getTargetScore, getScore, move, addScore } from '../scores.js';

test('sets rules on init', () => {
    init(11, 111, 1111);
    expect(getMinPackSize()).toBe(11);
    expect(getMovesLeft()).toBe(111);
    expect(getTargetScore()).toBe(1111);
});

test('move() must subtract 1 move', () => {
    init(11, 111, 1111);
    move();
    expect(getMovesLeft()).toBe(110);
});

test('addScore(n) adds n to the current score', () => {
    init(11, 111, 1111);
    addScore(5);
    addScore(15);
    expect(getScore()).toBe(20);
});
