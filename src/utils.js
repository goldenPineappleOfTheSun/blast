export function randomElement(array) {
    return array[((Math.random() * array.length) ^ 0) % array.length];
} 