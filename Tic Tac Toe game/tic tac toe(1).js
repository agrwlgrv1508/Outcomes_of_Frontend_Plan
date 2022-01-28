var origBoard;
let huPlayer ='O';
let aiPlayer = 'X';

let winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

let cells = document.querySelectorAll('.cell');



startGame();

function startGame(){
    document.querySelector('.endgame').style.display='none';
    origBoard = Array.from(Array(9).keys());
    for(let i =0; i<cells.length;i++){
        cells[i].innerText="";
        cells[i].style.removeProperty('Background-color');
        cells[i].addEventListener('click',playTurn)
    }
}

// This function is to play turn for either human player or AI player
function playTurn(square){
  if(typeof origBoard[square.target.id]=='number'){
    turn(square.target.id,huPlayer);
    if(!tiegame()){
        turn(bestsquare(),aiPlayer);
    }
  }
   
}
// This function displays the screen on playing turn 
function turn(squareId, player){
    origBoard[squareId]=player;
    document.getElementById(squareId).innerText=player;
    let gameWon = checkWin(origBoard,player);
    if(gameWon){
        gameOver(gameWon);
    }
}
//This function used either game is won or not after each move
function checkWin(board,player){
    let plays = board.reduce((a,e,i)=>
        (e===player)? a.concat(i) : a,[]);
    let gameWon = null;
    for(let [index,win] of winCombos.entries()){
        if(win.every(ele=>plays.indexOf(ele)>-1)){
            gameWon = {index:index, player:player};
            break;
        }
    }
    return gameWon;
}
//This function is used when the game is finished
function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
        gameWon.player==huPlayer? "blue" : "red";
    }

    for(let i=0;i<cells.length;i++){
        cells[i].removeEventListener('click',playTurn);
    }
    declareWinner(gameWon.player==huPlayer? 'You Win!':'You Lose!')
} 

//Function to display the winner name
function declareWinner(who){
    document.querySelector('.endgame').style.display="block";
    document.querySelector('.endgame .text').innerText=who;
}

// function used to tell about the unmarked cells
function emptySquares(){
    return origBoard.filter(element=> typeof element=='number');
}

//Function is for AI player to choose best move
function bestsquare(){
    return optimizedAlgo(origBoard,aiPlayer).index;
}
//This function is used when game is draw
function tiegame(){
    if(emptySquares().length==0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor="green";
            cells[i].removeEventListener('click',playTurn);
        }
        declareWinner("Tie Game")
        return true;
    }
    return false;
}
// Optimized Function to make unbeatable game
function optimizedAlgo(newBoard,player){
    var availableMoves = emptySquares();
    if(checkWin(newBoard,huPlayer)){
        return {score:-10};
    }
    else if(checkWin(newBoard,aiPlayer)){
        return {score:10}
    }
    else if(availableMoves.length==0){
        return {score:0};
    }

    var moves=[];
    for(let i=0;i<availableMoves.length;i++){
        var move ={};
        move.index=newBoard[availableMoves[i]];
        newBoard[availableMoves[i]]=player;

    if(player==aiPlayer){
        var result= optimizedAlgo(newBoard,huPlayer);
        move.score=result.score;
    }
    else{
        var result= optimizedAlgo(newBoard,aiPlayer);
        move.score=result.score;
    }

    newBoard[availableMoves[i]]=move.index;
    moves.push(move);
     
}

var bestMove;
if(player==aiPlayer){
    var bestScore=-1000;
    for(let i=0;i<moves.length;i++){
        if(moves[i].score>bestScore){
            bestScore=moves[i].score;
            bestMove=i;
        }
    }
}
else{
    var bestScore=1000;
    for(var i=0;i<moves.length;i++){
        if(moves[i].score<bestScore){
            bestScore=moves[i].score;
            bestMove=i;
        }
    }
}

return moves[bestMove];
}