function generatePiece() {
    const randomSeed = Math.floor(Math.random() * PIECES.length);
    const randomSeed2 = Math.floor(Math.random() * COLORS.length);
    return new Tetromino(PIECES[randomSeed], COLORS[randomSeed2]);
}

function getSpeed(score) {
    if (score < 50)
        return 1;
    else if (score >= 50 && score < 100)
        return 0.8;
    else if (score >= 100 && score < 150)
        return 0.7;
    else if (score >= 150 && score < 250)
        return 0.6;
    else if (score >= 250 && score < 500)
        return 0.5;
    else if (score >= 500 && score < 1000)
        return 0.25;
    else if (score >= 1000 && score < 2000)
        return 0.15;
    else if (score >= 2000)
        return 0.1;
}
