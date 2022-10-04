import { Container } from 'pixi.js';

/*
Посредник, с помощию которого основной игровой цикл может вызывать animate() у партиклей
Сначала нужно вызывать init, который вернёт PIXI-контейнер (в который будут складываться все новые партикли)
Затем достаточно вызывать createParticle для создания партиклей
и animateParticles для анимирования всех созданных разом
*/

let particles = [];
let container = new Container();

export function init() {
    return container;
}

export function createParticle(particle) {
    container.addChild(particle.getSprite());
    particles.push(particle);
}

export function animateParticles(delta) {
    let particlesToDelete = [];
    for (let particle of particles) {
        if (particle.isDestroyed()) {
            particlesToDelete.push(particle);
            container.removeChild(particle.getSprite());
            continue;
        }
        particle.animate(delta);
    }
}