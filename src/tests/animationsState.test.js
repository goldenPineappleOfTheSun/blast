import { AnimationsState } from '../animationsState.js';
import { FallingGem } from '../fallingGem.js';
import { SwappingGem } from '../swappingGem.js';
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

test('swapping gem must always move (visually)', () => {
    let gem = new SwappingGem({x:1, y:1}, {x:2, y:2}, gemTypes.red, 1000);
    let x1 = gem.offset.x;
    gem.animate();
    let x2 = gem.offset.x;
    gem.animate();
    let x3 = gem.offset.x;
    expect(x3).toBeGreaterThan(x2);
    expect(x2).toBeGreaterThan(x1);
});

test('swapping gem must not change x or y, only offset', () => {
    let gem = new SwappingGem({x:1, y:1}, {x:2, y:2}, gemTypes.red, 1000);
    let x1 = gem.x;
    gem.animate();
    let x2 = gem.x;
    expect(x1).toBe(1);
    expect(x2).toBe(1);
});

test('swapping gem must always arrive in time', () => {
    let gem = new SwappingGem({x:1, y:1}, {x:2.4, y:2.4}, gemTypes.red, 4);
    let x1 = gem.offset.x;
    let y1 = gem.offset.y;
    gem.animate();
    gem.animate();
    gem.animate();
    gem.animate();
    let x2 = gem.offset.x;
    let y2 = gem.offset.y;
    expect(x1).toBe(0);
    expect(y1).toBe(0);
    expect(x2).toBe(1.4);
    expect(x2).toBe(1.4);
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