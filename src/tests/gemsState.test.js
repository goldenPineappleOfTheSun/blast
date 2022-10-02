import { GemsState } from '../gemsState.js';
import { gemTypes } from '../GemTypes.js';

test('initializes array correctly', () => {
    const state = new GemsState(5, 6);
    expect(state.size.x).toBe(5);
    expect(state.size.y).toBe(6);
});

test('custom possibleTypes', () => {
    const state = new GemsState(5, 6, [gemTypes.purple, gemTypes.yellow]);
    expect(state.possibleTypes[0]).toBe(gemTypes.purple);
    expect(state.possibleTypes[1]).toBe(gemTypes.yellow);
    expect(state.possibleTypes.length).toBe(2);
});

test('put gems', () => {
    const state = new GemsState(5, 6, [gemTypes.red, gemTypes.blue, gemTypes.green]);
    state.put(0, 0, gemTypes.red)
    state.put(0, 1, gemTypes.blue)
    expect(state.get(0, 0)).toBe(gemTypes.red);
    expect(state.get(0, 1)).toBe(gemTypes.blue);
    expect(state.get(1, 0)).toBe(null);
});

test('can put any gems independently from custom possibleTypes', () => {
    const state = new GemsState(5, 6, [gemTypes.red, gemTypes.blue, gemTypes.green]);
    state.put(0, 0, gemTypes.purple)
    state.put(0, 1, gemTypes.yellow)
    expect(state.get(0, 0)).toBe(gemTypes.purple);
    expect(state.get(0, 1)).toBe(gemTypes.yellow);
    expect(state.get(1, 0)).toBe(null);
});

test('get gem', () => {
    const state = new GemsState(5, 6, [gemTypes.red, gemTypes.blue, gemTypes.green]);
    state.put(0, 0, gemTypes.red);
    state.put(0, 1, gemTypes.blue);
    expect(state.get(0, 0)).toBe(gemTypes.red);
    expect(state.get(0, 1)).toBe(gemTypes.blue);
    expect(state.get(1, 0)).toBe(null);
});

test('get gem from outside', () => {
    const state = new GemsState(3, 3);
    expect(state.get(-1, 0)).toBe(null);
    expect(state.get(3, 0)).toBe(null);
    expect(state.get(0, -1)).toBe(null);
    expect(state.get(0, 3)).toBe(null);
    expect(state.get(-1, -1)).toBe(null);
    expect(state.get(3, 3)).toBe(null);
});

test('get gem from a border or corner', () => {
    const state = new GemsState(3, 3);
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            state.put(i, j, gemTypes.blue);
        }
    }
    expect(state.get(0, 0)).toBe(gemTypes.blue);
    expect(state.get(2, 0)).toBe(gemTypes.blue);
    expect(state.get(2, 2)).toBe(gemTypes.blue);
    expect(state.get(0, 2)).toBe(gemTypes.blue);
});

test('custom possibleTypes argument is optional', () => {
    const state = new GemsState(3, 3);
});

test('fill with random gems', () => {
    const state = new GemsState(3, 3);
    state.fillRandom();
    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            expect(state.get(x, y)).not.toBe(null);
        }
    }
});

test('fillRandom puts only allowed gem types', () => {
    const allowed = [gemTypes.red, gemTypes.blue, gemTypes.green];
    const state = new GemsState(3, 3, allowed);
    state.fillRandom();
    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            expect(allowed).toContain(state.get(x, y));
        }
    }
});