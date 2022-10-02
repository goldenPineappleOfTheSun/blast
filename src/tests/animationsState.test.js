import { AnimationsState } from '../animationsState.js';
import { FallingGem } from '../fallingGem.js';
import { gemTypes } from '../GemTypes.js';

function createAnimationState() {
    return new AnimationsState()
        .handlerForGetCellState(()=>{})
        .handlerForPutStaticGem(()=>{})
        .handlerForGetFieldSize(()=>{return {x:1000, y:1000}});
}

test('throws error if wrong object type was put as a gem', () => {
    const astate = createAnimationState();
    expect(() => astate.put(6)).toThrow();
});

test('be able to put falling gem', () => {
    const astate = createAnimationState();
    astate.put(new FallingGem(0, 0, gemTypes.red));
    expect(astate.get(0, 0)).toBeTruthy();
});

test('falling gem must always fall', () => {
    let gem = new FallingGem(0, 0, gemTypes.red);
    let y1 = gem.y;
    gem.animate();
    let y2 = gem.y;
    gem.animate();
    let y3 = gem.y;
    expect(y3).toBeGreaterThan(y2);
    expect(y2).toBeGreaterThan(y1);
});

test('falling gem must accelerate', () => {
    let gem = new FallingGem(0, 0, gemTypes.red);
    let y1 = gem.y;
    gem.animate();
    let y2 = gem.y;
    gem.animate();
    let y3 = gem.y;
    expect(y3 - y2).not.toBe(y2 - y1);
});

test('state must find gems in requested cell or above (with offset)', () => {
    const astate = createAnimationState();
    astate.put(new FallingGem(1, 1, gemTypes.red, 0.1));
    expect(astate.get(1, 1).cell.type).toBe(gemTypes.red);
    expect(astate.get(2, 1).cell).toBe(null);
    astate.animate();
    expect(astate.get(1, 2).cell.type).toBe(gemTypes.red);
    expect(astate.get(1, 1).cell).toBe(null);
    expect(astate.get(2, 1).cell).toBe(null);
});

test('state can detect overllaped gems', () => {
    const astate = createAnimationState();
    astate.put(new FallingGem(1, 1, gemTypes.red, 0.1));
    expect(astate.get(1, 1).cell.type).toBe(gemTypes.red);
    expect(astate.get(2, 1).cell).toBe(null);
    astate.animate();
    expect(astate.get(1, 2).cell.type).toBe(gemTypes.red);
    expect(astate.get(1, 1).cell).toBe(null);
    expect(astate.get(2, 1).cell).toBe(null);
});