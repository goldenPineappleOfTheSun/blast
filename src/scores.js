let minPackSize = 2;
let moves = 10;
let target = 100;

export function init(_minPackSize, _moves, _target) {
    minPackSize = _minPackSize;
    moves = _moves;
    target = _target;
    updateMoves(moves);
    updateScore(0);
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

export function move() {
    moves--;
    updateMoves(moves);
}

export function score(n) {
    score += n;
    updateScore(moves);
}

function updateMoves(n) {
    const dom_moves = document.querySelector('.moves-text');
    if (dom_moves) {
        dom_moves.innerHTML = n;
    }
}

function updateScore(n) {
    const dom_score = document.querySelector('.score-text-2');
    if (dom_score) {
        dom_score.innerHTML = n;
    }
}