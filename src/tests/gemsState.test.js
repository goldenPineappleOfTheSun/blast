import { GemsState } from '../gemsState.js';
import { gemColors } from '../gemTypes.js';

test('initializes array correctly', () => {
    const state = new GemsState(5, 6);
    expect(state.size.x).toBe(5);
    expect(state.size.y).toBe(6);
});

test('custom possibleColors', () => {
    const state = new GemsState(5, 6, [gemColors.purple, gemColors.yellow]);
    expect(state.possibleColors[0]).toBe(gemColors.purple);
    expect(state.possibleColors[1]).toBe(gemColors.yellow);
    expect(state.possibleColors.length).toBe(2);
});

test('put gems', () => {
    const state = new GemsState(5, 6, [gemColors.red, gemColors.blue, gemColors.green]);
    state.put(0, 0, gemColors.red)
    state.put(0, 1, gemColors.blue)
    expect(state.get(0, 0)).toBe(gemColors.red);
    expect(state.get(0, 1)).toBe(gemColors.blue);
    expect(state.get(1, 0)).toBe(null);
});

test('can put any gems independently from custom possibleColors', () => {
    const state = new GemsState(5, 6, [gemColors.red, gemColors.blue, gemColors.green]);
    state.put(0, 0, gemColors.purple)
    state.put(0, 1, gemColors.yellow)
    expect(state.get(0, 0)).toBe(gemColors.purple);
    expect(state.get(0, 1)).toBe(gemColors.yellow);
    expect(state.get(1, 0)).toBe(null);
});

test('get gem', () => {
    const state = new GemsState(5, 6, [gemColors.red, gemColors.blue, gemColors.green]);
    state.put(0, 0, gemColors.red);
    state.put(0, 1, gemColors.blue);
    expect(state.get(0, 0)).toBe(gemColors.red);
    expect(state.get(0, 1)).toBe(gemColors.blue);
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
            state.put(i, j, gemColors.blue);
        }
    }
    expect(state.get(0, 0)).toBe(gemColors.blue);
    expect(state.get(2, 0)).toBe(gemColors.blue);
    expect(state.get(2, 2)).toBe(gemColors.blue);
    expect(state.get(0, 2)).toBe(gemColors.blue);
});

test('custom possibleColors argument is optional', () => {
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

test('fillRandom puts only allowed gem colors', () => {
    const allowed = [gemColors.red, gemColors.blue, gemColors.green];
    const state = new GemsState(3, 3, allowed);
    state.fillRandom();
    for (let x=0; x<3; x++) {
        for (let y=0; y<3; y++) {
            expect(allowed).toContain(state.get(x, y));
        }
    }
});