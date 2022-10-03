let layers = {}

export function showCurtain(layername, text) {
    layers[layername] = text;
    dom.showCurtain(text);
}

export function hideCurtain(layername) {
    layers[layername] = false;
    for (let layername in layers) {
        if (layers[layername]) {
            dom.showCurtain(layers[layername]);
            return;
        }
    }
    dom.hideCurtain();
}