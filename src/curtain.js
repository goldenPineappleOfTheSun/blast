import { Container, Graphics, Text } from 'pixi.js'

const curtain = new Container();
curtain.scale = {x:0, y:0};
const rectangle = new Graphics();
const announce = new Text('...', {
    fontFamily : 'Arial',
    fontSize: 60,
    fill : 0xffffff,
    align : 'center',
});
announce.anchor.set(0.5);
curtain.addChild(rectangle);
curtain.addChild(announce);

let layers = {}

export function init(layername, width, height) {
    rectangle.beginFill(0x000000);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.alpha = 0.5;
    announce.x = width / 2;
    announce.y = height / 2;
    layers[layername] = false;
    return curtain;
}

export function showCurtain(layername, text) {
    curtain.scale = {x:1, y:1};
    layers[layername] = text;
    announce.text = text;
}

export function hideCurtain(layername) {
    layers[layername] = false;
    for (let layername in layers) {
        if (layers[layername]) {
            announce.text = layers[layername];
            return;
        }
    }
    curtain.scale = {x:0, y:0};
}