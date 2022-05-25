"use strict";

const FLAG = "FLAG";
const EMPTY = "";
const MINE = "MINE";

// DOM ELEMENTS
const MINE_IMG = `💣`;
const FLAG_IMG = `🚩`;

// const MINE_IMG = `<img src = "img/mine.png" />`;
// const FLAG_IMG = `<img src = "img/flag.png" />`;

var gBoard;

var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  gGame.inOn = true;
  gBoard = buildBoard(gLevel.size);
  // console.table(gBoard);
  renderBoard(gBoard);
  // getRandomMines(2);
}

function buildBoard() {
  var board = createMat(4, 4);

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      var cell = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0,
      };
      // console.log(cell.minesAroundCount);
      var randomI = getRandomInt(1, 4);
      var randomj = getRandomInt(1, 4);
      // cell.isMine = board[randomI][randomj];
      board[i][j] = cell;
    }
  }

  return board;
}

function renderBoard() {
  var strHTML = "";

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;

    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j];

      var className = "";
      className = cell.isShown ? "shown" : "hidden";
      // TODO: take care of flags class later

      var dataAttrib = `data-i=${i} data-j=${j}`;

      strHTML += `\t<td ${dataAttrib}
        class="cell ${className}" 
        onclick="cellClicked(this,${i},${j})" 
        oncontextmenu="markCellWithFlag(this,ev,${i},${j})">\n`;

      if (cell.isShown === true) strHTML += MINE_IMG;

      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
    // console.log(strHTML);
  }
  var elBoard = document.querySelector("table");
  elBoard.innerHTML = strHTML;
  console.log(elBoard);
}

function setMinesNegsCount(cellI, cellJ, gBoard) {
  var negsCounter = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length - 1) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > gBoard[i].length - 1) continue;

      if (gBoard[i][j].isShown) negsCounter++;
    }
  }
  console.log(negsCounter);
  return negsCounter;
}

function getRandomMines(number, gBoard) {
  var randMines = 0;
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      var randomIdxI = getRandomInt(0, gLevel.size);
      var randomIdxJ = getRandomInt(0, gLevel.size);
      if (gBoard[randomIdxI][randomIdxJ].isMine) randMines++;
    }
  }
  if (randMines > number) return;
  else {
    return randMines;
  }
}

function cellClicked(elCell, i, j) {}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}
