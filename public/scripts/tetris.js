const g_socket = io(); // socket
g_socket.on('room-is-full', () => {
    alert("ROOM is FULL \n For now you can play single player only!  \n Please try again later!");
})
//GLOBALS
const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const cvsNextPiece = document.getElementById("next");
const ctxNextPiece = cvsNextPiece.getContext("2d");
const cvsEnemy = document.getElementById("tetrisClone");
let ctxEnemy = cvsEnemy.getContext("2d");
const g_scoreDiv = document.getElementById("score");
const g_scoreDivEnemy = document.getElementById("scoreEnemy");

const ROW = 20;// number of rows
const COL = 10;//number of columns
const SQUARE_LENGTH = 20; // 20x20 px square
const EMPTY = "BLACK";

//------------------ RUN GAME ---------------------
let g_pieceObj = generatePiece();
let g_boardObj = new Board(ctx, g_pieceObj, SQUARE_LENGTH, ROW, COL,
    PIECES, COLORS, EMPTY, g_scoreDiv, ctxNextPiece);
g_boardObj.drawBoard();
g_boardObj.drawNextBoard();
g_boardObj.drawNextPiece();
document.addEventListener("keydown", function (e) {
    g_boardObj.movePiece(e);
});

//Reset button
function reset() {
    g_boardObj.resetGame();
}

//using set timeout in order to give it time for initialisation
setTimeout(() => {
    g_boardObj.run();
}, 1000)

//Update enemy board
g_socket.on('update-board', (enemyBoard) => {
    console.log("Received board");
    let img = new Image();
    img.src = enemyBoard.boardCanvas;
    ctxEnemy.drawImage(img, 0, 0);
    g_scoreDivEnemy.innerHTML = enemyBoard.boardScore.toString();
})

setTimeout(() => {
    //Reset board when enemy joins room
    g_socket.on('1v1-game-started', () => {
        g_boardObj.resetGame();
    })
}, 2000);

