import { Loader, Sprite } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';
import { sleep } from './utils';

const loader = new Loader(); 
loader.add('spritesheet', 'img/spritesheet.json');
loader.load(resourcesLoaded);

const font = new FontFaceObserver('marvin');
font.load(null, 24000).then(fontsLoaded);


let areAllResourcesLoaded = false;
let areAllFontsLoaded = false;
const onLoaded = [];

function resourcesLoaded() {
    areAllResourcesLoaded = true;
    if (areAllFontsLoaded) {
        loaded();
    }
}

function fontsLoaded() {
    areAllFontsLoaded = true;
    if (areAllResourcesLoaded) {
        loaded();
    }
}

function loaded() {
    onLoaded.forEach(x => x());
}

export function onResourcesLoaded(func) {
    onLoaded.push(func);
}

export function getTexture(name) {
    return loader.resources.spritesheet.textures
        ? loader.resources.spritesheet.textures[`${name}.png`]
        : null;
}

export function getFrame(name) {
    return loader.resources.spritesheet.data
        ? loader.resources.spritesheet.data.frames[`${name}.png`].frame
        : {x:0, y:0, w:1, h:1};
}

onResourcesLoaded(async () => {
    async function wait() {
        await sleep(100);
        if (dom) {
            dom.loaded()
        } else {
            await wait();
        }
    }
    await wait();
});