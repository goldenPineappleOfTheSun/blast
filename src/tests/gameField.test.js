import { GameField } from '../gameField.js';
import { GemsState } from '../gemsState.js';
import { AnimationsState } from '../animationsState.js';
import { gemColors } from '../GemTypes.js';
import { init as initRules } from '../scores.js';


const gemState = new GemsState(1, 1);
const animationsState = new AnimationsState();

function createExampleAnimationState() {
    return new AnimationsState();
}

function createExampleGemState() {
    return new GemsState(4, 4)
        .put(0, 0, gemColors.blue)
        .put(1, 0, gemColors.red)
        .put(2, 0, gemColors.red)
        .put(3, 0, gemColors.green)
        .put(0, 1, gemColors.yellow)
        .put(1, 1, gemColors.yellow)
        .put(2, 1, gemColors.green)
        .put(3, 1, gemColors.green)
        .put(0, 2, gemColors.yellow)
        .put(1, 2, gemColors.yellow)
        .put(2, 2, gemColors.red)
        .put(3, 2, gemColors.blue)
        .put(0, 3, gemColors.blue)
        .put(1, 3, gemColors.blue)
        .put(2, 3, gemColors.blue)
        .put(3, 3, gemColors.blue)
}

function createExampleField() {
    return new GameField(0, 0)
        .setStateHolders(createExampleGemState(), animationsState)
        .setDimensions(4, 4, 100, 100);
}

const exampleField1 = createExampleField();

test('throws error if "start" called before dimensions set', () => {
    const field = new GameField(0, 0).setStateHolders(gemState, animationsState);
    expect(field.start).toThrow();
});

test('throws error if "start" called before state holders set', () => {
    const field = new GameField(0, 0).setDimensions(5, 5, 100, 100);
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
        .start();
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

test('checkIfPackable with different packSize rule', () => {
    initRules(1, 1, 1);
    const field1 = exampleField1;
    expect(field1.checkIfPackable(0, 0)).toBeTruthy();
    expect(field1.checkIfPackable(3, 3)).toBeTruthy();

    initRules(2, 1, 1);
    const field2 = exampleField1;
    expect(field2.checkIfPackable(0, 0)).toBe(false);
    expect(field2.checkIfPackable(1, 0)).toBeTruthy();
    expect(field2.checkIfPackable(3, 3)).toBeTruthy();

    initRules(3, 1, 1);
    const field3 = exampleField1;
    expect(field3.checkIfPackable(0, 0)).toBe(false);
    expect(field3.checkIfPackable(1, 0)).toBe(false);
    expect(field3.checkIfPackable(3, 0)).toBeTruthy();
    expect(field3.checkIfPackable(3, 3)).toBeTruthy();

    initRules(4, 1, 1);
    const field4 = exampleField1;
    expect(field4.checkIfPackable(0, 0)).toBe(false);
    expect(field4.checkIfPackable(3, 0)).toBe(false);
    expect(field4.checkIfPackable(1, 1)).toBeTruthy();
    expect(field4.checkIfPackable(3, 3)).toBeTruthy();

    initRules(5, 1, 1);
    const field5 = exampleField1;
    expect(field5.checkIfPackable(0, 0)).toBe(false);
    expect(field5.checkIfPackable(3, 0)).toBe(false);
    expect(field5.checkIfPackable(1, 1)).toBe(false);
    expect(field5.checkIfPackable(3, 3)).toBeTruthy();

    initRules(6, 1, 1);
    const field6 = exampleField1;    
    expect(field6.checkIfPackable(0, 0)).toBe(false);
    expect(field6.checkIfPackable(3, 0)).toBe(false);
    expect(field6.checkIfPackable(1, 1)).toBe(false);
    expect(field6.checkIfPackable(3, 3)).toBe(false);
});

test('click must destroy packable gems', () => {
    const state1 = createExampleGemState();
    initRules(3, 1, 1);
    const field1 = createExampleField().setStateHolders(state1, animationsState).start();
    field1.click(0, 0);
    expect(state1.get(0, 0)).toBe(gemColors.blue);

    field1.click(1, 1);
    expect(state1.get(1, 1)).toBe(null);
    expect(state1.get(0, 1)).toBe(null);

    const state2 = createExampleGemState();
    initRules(5, 1, 1);
    const field2 = createExampleField().setStateHolders(state2, animationsState).start();
    field2.click(0, 0);
    expect(state2.get(0, 0)).toBe(gemColors.blue);

    field2.click(1, 1);
    expect(state2.get(1, 1)).toBe(gemColors.yellow);
    expect(state2.get(0, 1)).toBe(gemColors.yellow);
});

test('click must make upper gems falling', () => {
    const state1 = createExampleGemState();
    initRules(3, 1, 1);
    const field1 = createExampleField().setStateHolders(state1, animationsState).start();
    field1.click(0, 0);
    expect(state1.get(0, 0)).toBe(gemColors.blue);

    field1.click(1, 1);
    expect(state1.get(0, 0)).toBe(null);
    expect(state1.get(1, 0)).toBe(null);
    expect(state1.get(2, 0)).toBe(gemColors.red);
    expect(state1.get(1, 1)).toBe(null);
    expect(state1.get(0, 1)).toBe(null);
});

test('click create new blocks above', () => {
    const state1 = createExampleGemState();
    const astate1 = createExampleAnimationState();
    initRules(3, 1, 1);
    const field1 = createExampleField().setStateHolders(state1, astate1).start();
    field1.click(1, 1);
    expect(astate1.count()).toBe(6);
});

test('clicks dont do anything if start never called', () => {
    const state1 = createExampleGemState();
    initRules(3, 1, 1);
    const field1 = createExampleField().setStateHolders(state1, animationsState);
    field1.click(1, 1);
    expect(state1.get(1, 1)).toBe(gemColors.yellow);
    expect(state1.get(0, 1)).toBe(gemColors.yellow);
});

test('clicks dont do anything when gamefield on a wrong stage', () => {
    const state1 = createExampleGemState();
    initRules(3, 1, 1);
    const field1 = createExampleField().setStateHolders(state1, animationsState).start();
    field1.click(1, 1);
    expect(state1.get(1, 1)).toBe(null);
    expect(state1.get(0, 1)).toBe(null);
    field1.click(3, 3);
    expect(state1.get(3, 3)).toBe(gemColors.blue);
    expect(state1.get(2, 3)).toBe(gemColors.blue);
});

test('if there are no moves at the beginning game field must shuffle', () => {
    initRules(3000, 1, 1);
    const state = createExampleGemState();
    const field = createExampleField().setStateHolders(state, animationsState).start();
    expect(field.stage).toBe(4);
});

test('if there are moves at the beginning then game musnt shuffle', () => {
    initRules(1, 1, 1);
    const state = createExampleGemState();
    const field = createExampleField().setStateHolders(state, animationsState).start();
    expect(field.stage).toBe(1);
});

test('if there are no moves left - game is over', () => {
    initRules(1, 1, 1e9);
    const state = createExampleGemState();
    const field = createExampleField().setStateHolders(state, animationsState).start();
    field.click(1, 1);
    expect(field.stage).toBe(6);
});

/*
TODO: замокать animation state и проверить сложные кейсы:
после клика поле всегда заполняется полностью новыми камнями
клик может привести к шафлу, если нет ходов, 
много щафлов приводят к поражению
*/

/*
TODO: придумать как проверять начисление очков.. трудность в том, что они начисляются асинхронно и не сразу при клике
*/