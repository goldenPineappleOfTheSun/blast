import * as PIXI from 'pixi.js'

export class ScoreProgressPanel {
    constructor(x, y, width, height) {
        this.sprite = new PIXI.Container();

        let panelSprite = new PIXI.Graphics();
        panelSprite.beginFill(0xDE3249);
        panelSprite.drawRect(0, 0, width, height);
        panelSprite.endFill();
        panelSprite.x = x;
        panelSprite.y = y;
        this.sprite.addChild(panelSprite);
    }

    getSprite() {
        return this.sprite;
    }
}