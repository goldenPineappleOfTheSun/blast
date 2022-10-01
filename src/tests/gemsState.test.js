import { GemsState } from '../gemsState.js';

test('initializes array correctly', () => {
    const state = new GemsState(5, 6);
    expect(state.size.x).toBe(5);
    expect(state.size.y).toBe(6);
});