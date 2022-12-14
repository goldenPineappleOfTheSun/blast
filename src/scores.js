/*
глобальный модуль с глобальными переменными
помнит текущие очки и установленные правила, например, количество ходов
*/

let minPackSize = 2;
let moves = 10;
let score = 0;
let scoreYelling = 0;
let target = 100;
let maxShuffles = 100;

/*
настроить правила игры
_minPackSize - сколько камней должно стоять рядом, чтобы по ним можно было кликнуть
_moves - количество ходов
_target - сколько очков надо набрать
_maxShuffles - сколько раз подряд игра будет перетасовывать неудачный расклад, прежде чем сдастся
*/
export function init(_minPackSize = 2, _moves = 25, _target = 1000, _maxShuffles = 10) {
    minPackSize = _minPackSize;
    moves = _moves;
    target = _target;
    maxShuffles = _maxShuffles;
    updateMoves(moves);
    updateScore(0);
    updateTarget(target)
}

export function getMinPackSize() {
    return minPackSize;
}

export function getMovesLeft() {
    return moves;
}

export function getTargetScore() {
    return target;
}

export function getMaxConsequentShuffles() {
    return maxShuffles;
}

export function getScore() {
    return score;
}

/*
минус 1 ход
*/
export function move() {
    moves--;
    updateMoves(moves);
}

/*
добавть n очков
*/
export function addScore(n) {
    score += n;
    updateScore(score);
    scoreYelling = Math.min(50, scoreYelling + n * 3);
}

export function animate(delta) {
    scoreYelling *= (1 - 0.1 * delta); 

    const dom_score = document.querySelector('.score-text-2');
    if (dom_score) {
        dom_score.style.transform = `scale(${1 + scoreYelling * 0.03})`;
    }
}

function updateMoves(n) {
    const dom_moves = document.querySelector('.moves-text');
    if (dom_moves) {
        dom_moves.innerHTML = n;
    }
}

function updateScore(n) {
    const dom_score = document.querySelector('.score-text-2');
    const dom_progress = document.querySelector('.progress-fill');
    if (dom_score) {
        dom_score.innerHTML = n;
        dom_progress.style.width = `${(score / target) * 100}%`;
    }
}

function updateTarget(n) {
    const dom_score = document.querySelector('.score-text-4');
    const dom_progress = document.querySelector('.progress-fill');
    if (dom_score) {
        dom_score.innerHTML = target;
    }
}