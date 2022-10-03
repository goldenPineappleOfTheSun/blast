import { Container } from 'pixi.js';

let particles = [];
let container = new Container();

export function init() {
    return container;
}

export function createParticle(particle) {
    container.addChild(particle.getSprite());
    console.log(container)
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