import { Loader } from 'pixi.js';

const loader = new Loader(); 
loader.add('blue', 'img/blue.png');
loader.add('red', 'img/red.png');
loader.load(resourcesLoaded);

const onLoaded = [];

function resourcesLoaded() {
    onLoaded.forEach(x => x());
}

export function onResourcesLoaded(func) {
    onLoaded.push(func);
}

export function getTexture(name) {
    return loader.resources[name].texture;
}