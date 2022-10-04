/*
Тёмная занавеска
Например, появляется при нажатии на паузу (на момент написания)
Визуальная часть была вынесена в html, 
поэтому сам модуль занимается только тем, что запоминает сколько одновременных зановесок было вызвано,
чтобы они не наезжали друг на друга, но при этом и не отключали друг друга случайно
*/

let layers = {}

/* 
layername - название занавески. если нет, то создаст
text - текст для отображения
*/
export function showCurtain(layername, text) {
    layers[layername] = text;
    dom.showCurtain(text);
}

/* 
layername - название занавески, если это была последняя открытая, то все занавески скроются
*/
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