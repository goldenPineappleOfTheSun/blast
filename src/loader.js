import { Loader, Sprite } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';

const loader = new Loader(); 
loader.add('spritesheet', 'img/spritesheet.json');
loader.load(resourcesLoaded);

const font = new FontFaceObserver('marvin');
font.load().then(fontsLoaded);


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
    return loader.resources.spritesheet.textures[`${name}.png`];
}

export function getFrame(name) {
    return loader.resources.spritesheet.data.frames[`${name}.png`].frame;
}