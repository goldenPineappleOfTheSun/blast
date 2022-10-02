import { GameField } from '../gameField.js';
import { GemsState } from '../gemsState.js';

const gemState = new GemsState(1, 1);
const animationsState = {};

test('throws error if "start" called before dimensions set', () => {
    const field = new GameField(0, 0).setStateHolders(gemState, animationsState);
    expect(field.start).toThrow();
});

test('throws error if "start" called before state holders set', () => {
    const field = new GameField(0, 0).setDimensions(5, 5, 100, 100);
    expect(field.start).toThrow();
});

test('throws error if "start" called two times', () => {
    const field = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 2, 2, 2).start();
    expect(field.start).toThrow();
});

test('calculates width correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100);
    expect(field1.width).toBe(100);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 1, 100, 100);
    expect(field2.width).toBe(100);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(1, 5, 100, 100);
    expect(field3.width).toBe(20);
});

test('calculates height correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(3, 3, 100, 100);
    expect(field1.height).toBe(100);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(4, 1, 100, 100);
    expect(field2.height).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(1, 4, 100, 100);
    expect(field3.height).toBe(100);
});

test('calculates gem size correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100);
    expect(field1.gemSize).toBe(20);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 4, 100, 100);
    expect(field2.gemSize).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(20, 1, 100, 100);
    expect(field3.gemSize).toBe(5);
});

test('calculates gem position correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100);
    expect(field1.position.x).toBe(0);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 4, 100, 100);
    expect(field2.position.x).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(20, 1, 100, 100);
    expect(field3.position.x).toBe(0);
});