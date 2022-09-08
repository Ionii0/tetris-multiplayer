class Board {
    constructor(ctx, tetromino, squareSize, row, col, pieces, colors, empty, scoreDiv, ctxNextBoard) {
        this.ctx = ctx;
        this.tetromino = tetromino;
        this.squareSize = squareSize;
        this.row = row;
        this.col = col;
        this.rowNextPiece = 5;
        this.colNextPiece = 5;
        this.pieces = pieces;
        this.colors = colors;
        this.empty = empty;
        this.scoreDiv = scoreDiv;
        this.ctxNextBoard = ctxNextBoard;

        this.board = [];
        this.nextPieceBoard = [];
        this.dropBeginsAt = Date.now();
        this.score = 0;
        this.gameOver = false;
        this.nextPiece = this.generatePiece();
        this.initBoard();
        this.initNextPieceBoard();
    }

    initBoard() {
        for (let r = 0; r < this.row; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.col; c++) {
                this.board[r][c] = this.empty;
            }
        }
    }

    //DRAW FUNCTIONS
    drawSquare(row, col, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(row * this.squareSize, col * this.squareSize, this.squareSize, this.squareSize);

        this.ctx.strokeStyle = "BLACK";
        this.ctx.strokeRect(row * this.squareSize, col * this.squareSize, this.squareSize, this.squareSize);
    }

    drawBoard() {
        for (let row = 0; row < this.row; row++) {
            for (let col = 0; col < this.col; col++) {
                this.drawSquare(col, row, this.board[row][col]);
            }
        }
    }

    resetBoard() {
        this.initBoard()
        for (let row = 0; row < this.row; row++) {
            for (let col = 0; col < this.col; col++) {
                this.drawSquare(col, row, this.empty);
            }
        }
    }

    drawTetromino() {
        for (let row = 0; row < this.tetromino.currentTetromino.length; row++) {
            for (let col = 0; col < this.tetromino.currentTetromino.length; col++) {
                if (this.tetromino.currentTetromino[row][col])
                    this.drawSquare(this.tetromino.posX + col, this.tetromino.posY + row, this.tetromino.color);
            }
        }
    }

    eraseTetromino() {
        for (let row = 0; row < this.tetromino.currentTetromino.length; row++) {
            for (let col = 0; col < this.tetromino.currentTetromino.length; col++) {
                if (this.tetromino.currentTetromino[row][col])
                    this.drawSquare(this.tetromino.posX + col, this.tetromino.posY + row, this.empty);
            }
        }
    }

    drawGameOver() {
        this.ctx.font = "32px Poppins";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Game Over!", 15, this.ctx.canvas.height / 2);
    };

    //PIECE MOVEMENT
    moveTetrominoDown() {
        if (!this.detectedCollision(0, 1, this.tetromino.currentTetromino)) {
            this.eraseTetromino();
            this.tetromino.posY++;
            this.drawTetromino();
        } else {
            this.lockTetromino();
            delete this.tetromino;
            this.tetromino = this.nextPiece;
            this.eraseNextPiece();
            this.nextPiece = this.generatePiece();
            this.drawNextPiece();
        }
    }

    moveTetrominoLeft() {
        if (!this.detectedCollision(-1, 0, this.tetromino.currentTetromino)) {
            this.eraseTetromino();
            this.tetromino.posX--;
            this.drawTetromino();
        }
    }

    moveTetrominoRight() {
        if (!this.detectedCollision(1, 0, this.tetromino.currentTetromino)) {
            this.eraseTetromino();
            this.tetromino.posX++;
            this.drawTetromino();
        }
    }


    rotateTetromino() {
        const nextRotation = this.tetromino.tetromino[(this.tetromino.tetrominoRotation + 1) % this.tetromino.tetromino.length];
        let shiftPosition = 0;
        if (this.detectedCollision(0, 0, nextRotation)) {
            if (this.tetromino.posX > this.col / 2)
                shiftPosition = -1;
            else {
                shiftPosition = +1;
            }
        }
        if (!this.detectedCollision(0, 0, nextRotation)) {
            this.eraseTetromino();
            this.tetromino.posX += shiftPosition;
            this.tetromino.tetrominoRotation = (this.tetromino.tetrominoRotation + 1) % this.tetromino.tetromino.length;
            this.tetromino.currentTetromino = this.tetromino.tetromino[this.tetromino.tetrominoRotation];
            this.drawTetromino();
        }

    }


    // PIECE BEHAVIOR UTILS
    lockTetromino() {
        for (let row = 0; row < this.tetromino.currentTetromino.length; row++) {
            for (let col = 0; col < this.tetromino.currentTetromino.length; col++) {
                if (!this.tetromino.currentTetromino[row][col]) {
                    continue;
                }
                if (this.tetromino.posY + row < 0) {
                    this.gameOver = true;
                    alert("Game Over!");
                    this.drawGameOver();
                    break;
                }
                this.board[this.tetromino.posY + row][this.tetromino.posX + col] = this.tetromino.color;
            }
        }
        for (let row = 0; row < this.row; row++) {
            let isRowFull = true;
            for (let col = 0; col < this.row; col++) {
                isRowFull = isRowFull && (this.board[row][col] !== this.empty);
            }
            if (isRowFull) {
                for (let i = row; i > 1; i--) {
                    for (let j = 0; j < this.col; j++) {
                        this.board[i][j] = this.board[i - 1][j];
                    }
                }
                for (let j = 0; j < this.col; j++) {
                    this.board[0][j] = this.empty;
                }
                this.score += 10;
            }
        }
        this.drawBoard();
        this.scoreDiv.innerHTML = this.score.toString();
    }

    detectedCollision(x, y, tetrominoPattern) {
        for (let row = 0; row < tetrominoPattern.length; row++) {
            for (let col = 0; col < tetrominoPattern.length; col++) {
                if (!tetrominoPattern[row][col]) {
                    continue;
                }
                let newPosX = this.tetromino.posX + col + x;
                let newPosY = this.tetromino.posY + row + y;
                if (newPosX < 0 || newPosX >= this.col || newPosY >= this.row) {
                    return true;
                }
                if (newPosY < 0) {
                    continue;
                }
                if (this.board[newPosY][newPosX] !== this.empty) {
                    return true;
                }
            }
        }
        return false;
    }

    movePiece(event) {
        if (!this.gameOver) {
            switch (event.keyCode) {
                case 37:
                    this.moveTetrominoLeft();
                    break;
                case 38:
                    this.rotateTetromino();
                    break;
                case 39:
                    this.moveTetrominoRight()
                    break;
                case 40:
                    this.moveTetrominoDown()
                    break;
            }
        }
    }

//RUN
    run() {
        if (!this.gameOver) {
            const data = {boardCanvas: this.ctx.canvas.toDataURL(), boardScore: this.score};
            g_socket.emit('update-board', data);
            let now = Date.now();
            let deltaTime = now - this.dropBeginsAt;
            let speedModifier = getSpeed(this.score);
            if (deltaTime > 1000 * speedModifier) {
                this.moveTetrominoDown();
                this.dropBeginsAt = Date.now();
            }
            requestAnimationFrame(() => {
                this.run(this)
            });
        } else this.drawGameOver();
    }

//NEXT PIECE
    initNextPieceBoard() {
        for (let r = 0; r < this.rowNextPiece; r++) {
            this.nextPieceBoard[r] = [];
            for (let c = 0; c < this.colNextPiece; c++) {
                this.nextPieceBoard[r][c] = this.empty;
            }
        }
    }

    drawNextBoard() {
        for (let row = 0; row < this.rowNextPiece; row++) {
            for (let col = 0; col < this.colNextPiece; col++) {
                this.drawNextSquare(col, row, this.board[row][col]);
            }
        }
    }

    resetNextBoard() {
        this.initNextPieceBoard();
        for (let row = 0; row < this.rowNextPiece; row++) {
            for (let col = 0; col < this.colNextPiece; col++) {
                this.drawNextSquare(col, row, this.empty);
            }
        }
    }

    drawNextSquare(row, col, color) {
        this.ctxNextBoard.fillStyle = color;
        this.ctxNextBoard.fillRect(row * this.squareSize, col * this.squareSize, this.squareSize, this.squareSize);

        this.ctxNextBoard.strokeStyle = "BLACK";
        this.ctxNextBoard.strokeRect(row * this.squareSize, col * this.squareSize, this.squareSize, this.squareSize);
    }

    eraseNextPiece() {
        for (let row = 0; row < this.nextPiece.currentTetromino.length; row++) {
            for (let col = 0; col < this.nextPiece.currentTetromino.length; col++) {
                if (this.nextPiece.currentTetromino[row][col])
                    this.drawNextSquare(this.nextPiece.posX - 3 + col, this.nextPiece.posY + 3 + row, this.empty);
            }
        }
    }

    drawNextPiece() {
        for (let row = 0; row < this.nextPiece.currentTetromino.length; row++) {
            for (let col = 0; col < this.nextPiece.currentTetromino.length; col++) {
                if (this.nextPiece.currentTetromino[row][col])
                    //I had to offset the piece by -3 on x and +3 on y axis
                    this.drawNextSquare(this.nextPiece.posX - 3 + col, this.nextPiece.posY + 3 + row, this.nextPiece.color);
            }
        }
    }


//UTILS
    generatePiece() {
        const randomSeed = Math.floor(Math.random() * this.pieces.length);
        return new Tetromino(this.pieces[randomSeed], this.generateColor());
    }

    generateColor() {
        const randomSeed = Math.floor(Math.random() * this.colors.length);
        return this.colors[randomSeed];
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.tetromino = this.generatePiece();
        this.nextPiece = this.generatePiece();

        this.resetBoard();
        this.resetNextBoard();
        this.drawNextPiece();
        this.run();
    }
}
