import { Loader } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';

const loader = new Loader(); 
loader.add('blue', 'img/blue.png');
loader.add('purple', 'img/purple.png');
loader.add('red', 'img/red.png');
loader.add('yellow', 'img/yellow.png');
loader.add('green', 'img/green.png');
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
    return loader.resources[name].texture;
}