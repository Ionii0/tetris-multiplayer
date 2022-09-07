class Tetromino {
    constructor(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoRotation = 0;
        this.currentTetromino = this.tetromino[this.tetrominoRotation];
        this.posX = 4;
        this.posY = -2;
    }


}
