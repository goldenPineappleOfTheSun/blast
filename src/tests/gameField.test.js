import { GameField } from '../gameField.js';
import { GemsState } from '../gemsState.js';
import { gemTypes } from '../GemTypes.js';


const gemState = new GemsState(1, 1);
const animationsState = {};

const exampleGemState1 = new GemsState(4, 4)
    .put(0, 0, gemTypes.blue)
    .put(1, 0, gemTypes.red)
    .put(2, 0, gemTypes.red)
    .put(3, 0, gemTypes.green)
    .put(0, 1, gemTypes.yellow)
    .put(1, 1, gemTypes.yellow)
    .put(2, 1, gemTypes.green)
    .put(3, 1, gemTypes.green)
    .put(0, 2, gemTypes.yellow)
    .put(1, 2, gemTypes.yellow)
    .put(2, 2, gemTypes.red)
    .put(3, 2, gemTypes.blue)
    .put(0, 3, gemTypes.blue)
    .put(1, 3, gemTypes.blue)
    .put(2, 3, gemTypes.blue)
    .put(3, 3, gemTypes.blue)

const exampleField1 = new GameField(0, 0)
    .setStateHolders(exampleGemState1, animationsState)
    .setDimensions(4, 4, 100, 100)
    .setRules(2);

test('throws error if "start" called before dimensions set', () => {
    const field = new GameField(0, 0).setStateHolders(gemState, animationsState).setRules(2);
    expect(field.start).toThrow();
});

test('throws error if "start" called before state holders set', () => {
    const field = new GameField(0, 0).setDimensions(5, 5, 100, 100).setRules(2);
    expect(field.start).toThrow();
});

test('throws error if "start" called before state holders set', () => {
    const field = new GameField(0, 0).setStateHolders(gemState, animationsState).setDimensions(5, 5, 100, 100);
    expect(field.start).toThrow();
});


test('throws error if "start" called two times', () => {
    const field = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 2, 2, 2)
        .setRules(2)
        .start();
    expect(field.start).toThrow();
});

test('calculates width correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100)
        .setRules(2);
    expect(field1.width).toBe(100);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 1, 100, 100)
        .setRules(2);
    expect(field2.width).toBe(100);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(1, 5, 100, 100)
        .setRules(2);
    expect(field3.width).toBe(20);
});

test('calculates height correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(3, 3, 100, 100)
        .setRules(2);
    expect(field1.height).toBe(100);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(4, 1, 100, 100)
        .setRules(2);
    expect(field2.height).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(1, 4, 100, 100)
        .setRules(2);
    expect(field3.height).toBe(100);
});

test('calculates gem size correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100)
        .setRules(2);
    expect(field1.gemSize).toBe(20);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 4, 100, 100)
        .setRules(2);
    expect(field2.gemSize).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(20, 1, 100, 100)
        .setRules(2);
    expect(field3.gemSize).toBe(5);
});

test('calculates gem position correctly', () => {
    const field1 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(5, 5, 100, 100)
        .setRules(2);
    expect(field1.position.x).toBe(0);

    const field2 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(2, 4, 100, 100)
        .setRules(2);
    expect(field2.position.x).toBe(25);

    const field3 = new GameField(0, 0)
        .setStateHolders(gemState, animationsState)
        .setDimensions(20, 1, 100, 100)
        .setRules(2);
    expect(field3.position.x).toBe(0);
});

test('checkIfPackable with different packSize rule', () => {
    const field1 = exampleField1.setRules(1);
    expect(field1.checkIfPackable(0, 0)).toBe(true);
    expect(field1.checkIfPackable(3, 3)).toBe(true);

    const field2 = exampleField1.setRules(2);
    expect(field2.checkIfPackable(0, 0)).toBe(false);
    expect(field2.checkIfPackable(1, 0)).toBe(true);
    expect(field2.checkIfPackable(3, 3)).toBe(true);

    const field3 = exampleField1.setRules(3);
    expect(field3.checkIfPackable(0, 0)).toBe(false);
    expect(field3.checkIfPackable(1, 0)).toBe(false);
    expect(field3.checkIfPackable(3, 0)).toBe(true);
    expect(field3.checkIfPackable(3, 3)).toBe(true);

    const field4 = exampleField1.setRules(4);
    expect(field4.checkIfPackable(0, 0)).toBe(false);
    expect(field4.checkIfPackable(3, 0)).toBe(false);
    expect(field4.checkIfPackable(1, 1)).toBe(true);
    expect(field4.checkIfPackable(3, 3)).toBe(true);

    const field5 = exampleField1.setRules(5);
    expect(field5.checkIfPackable(0, 0)).toBe(false);
    expect(field5.checkIfPackable(3, 0)).toBe(false);
    expect(field5.checkIfPackable(1, 1)).toBe(false);
    expect(field5.checkIfPackable(3, 3)).toBe(true);

    const field6 = exampleField1.setRules(6);
    expect(field6.checkIfPackable(0, 0)).toBe(false);
    expect(field6.checkIfPackable(3, 0)).toBe(false);
    expect(field6.checkIfPackable(1, 1)).toBe(false);
    expect(field6.checkIfPackable(3, 3)).toBe(false);
});