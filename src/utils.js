/*
выбирает случайный элемент из переданного списка
*/
export function randomElement(array) {
    return array[((Math.random() * array.length) ^ 0) % array.length];
} 

/*
выбирает случайное целое от 0 до n включительно
*/
export function dice(n) {
    return (Math.random() * n * 2) % n ^ 0;
} 

/*
выбирает случайное целое от 0 до n включительно
*/
export function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    });
} 