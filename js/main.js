"use strict";

const EMPTY = "";

// DOM ELEMENTS
const MINE_IMG = `💣`;
const FLAG_IMG = `🚩`;

var gLives;
var gClickCount;
var gMinededCellCount = 0;
var gBoard;

var gLevel = {
  size: 4, // 8 / 12
  mines: 2, // 12 // 30
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

var gLevels = [
  { id: 0, name: "Easy", boardSize: 4, mineNums: 2 },
  { id: 1, name: "Medium", boardSize: 8, mineNums: 12 },
  { id: 2, name: "Hard", boardSize: 12, mineNums: 30 },
];

function init() {
  gGame.inOn = true;
  gBoard = buildBoard(gLevel.size);
  gClickCount = 0;
  gLives = 3;
  renderLevel();
  createLivesCounter(gLives);
  renderBoard(gBoard);
}

function buildBoard(size) {
  var board = createMat(size, size);

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var cell = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0,
      };
      board[i][j] = cell;
      if (
        (i === getRandomInt(0, gLevel.size) ||
          j === getRandomInt(0, gLevel.size)) &&
        gMinededCellCount < gLevel.mines
      ) {
        cell.isMine = true;
        gMinededCellCount++;
      }
      board[i][j] = cell;
    }
  }
  console.table(board);
  return board;
}

function renderBoard() {
  var strHTML = "";

  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>\n`;

    for (var j = 0; j < gBoard[i].length; j++) {
      var cell = gBoard[i][j];
      var numOfNeg = setMinesNegsCount(i, j);

      var className = "";
      className += cell.isShown ? "shown " : "hidden ";
      className += cell.isMine ? "mine " : EMPTY;
      className += cell.isMarked ? "flag " : EMPTY;

      var dataAttrib = `data-i=${i} data-j=${j}`;

      strHTML += `\t<td ${dataAttrib}
        class="cell ${className}" 
        onclick="cellClicked(this,${i},${j})" 
        oncontextmenu="cellMarked(this,event,${i},${j})">\n`;

      if (cell.isMine === true) strHTML += `<span> ${MINE_IMG} </span>`;
      else {
        cell.minesAroundCount = numOfNeg;
        strHTML += `<span> ${numOfNeg} </span>`;
      }

      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
    // console.log(strHTML);
  }

  var elBoard = document.querySelector("table");
  elBoard.innerHTML = strHTML;
  // console.log(elBoard);
}

function createLivesCounter(number) {
  var elCounter = document.querySelector(".live span");

  elCounter.innerHTML = number;
}

function setMinesNegsCount(cellI, cellJ) {
  var negsCounter = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > gLevel.size - 1) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > gLevel.size - 1) continue;

      if (gBoard[i][j].isMine) negsCounter++;
    }
  }

  return negsCounter;
}

function getRandomMines(number, i, j, board) {
  var randMines = 0;

  while (randMines < number) {
    var celli = getRandomInt(0, gBoard.length - 1);
    var cellj = getRandomInt(0, gBoard.length - 1);
    if (celli === i && cellj === j) continue;
    board[celli][cellj].isMine === true;
    randMines++;
  }
  console.log(randMines);
}

function cellClicked(elCell, i, j) {
  var cell = gBoard[i][j];
  var elCellContent = elCell.querySelector("td span");

  if (gClickCount === 0 && cell.isMine === true) {
    return;
  }
  gClickCount++;

  if (cell.isShown) return;
  if (!cell.isShown) {
    cell.isShown = true;
    gGame.shownCount++;

    elCell.classList.remove("hidden");
    elCell.classList.add("shown");

    elCellContent.style.visibility = "visible";

    if (elCellContent.innerText === "0") {
      expandShown(gBoard, elCell, i, j);
      elCellContent.innerText = EMPTY;
    }
  }

  if (cell.isMine === true) {
    gLives--;
    console.log(gLives);
    createLivesCounter(gLives);
    if (gLives === 0) {
      gGame.on = false;
      return;
    }
  }
}

function cellMarked(elCell, ev, i, j) {
  ev.preventDefault();

  var cell = gBoard[i][j];

  if (cell.isMarked === false) {
    cell.isMarked = true;

    elCell.innerText = FLAG_IMG;
  } else {
    cell.isMarked = false;
    elCell.innerText = EMPTY;
  }
  if (cell.isMine && cell.isMarked) gGame.markedCount++;
  console.log(gGame.markedCount);

  if (gGame.markedCount === gMinededCellCount) {
    checkGameOver();
  }
}

// TODO:
function looseGame() {
  gGame.isOn = false;
  renderRestartButton("☠");
}

function renderRestartButton(emoji) {
  var elLife = document.querySelector(".btn-play-again");
  elLife.innerText = emoji;
}

function expandShown(board, elCell, i, j) {
  for (var idxI = i - 1; idxI <= i + 1; idxI++) {
    if (idxI < 0 || idxI > gLevel.size - 1) continue;

    for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
      if (idxI === i && idxJ === j) continue;
      if (idxJ < 0 || idxJ > gLevel.size - 1) continue;

      board[idxI][idxJ].isShown = true;

      var elNegs = document.querySelector(
        `[data-i="${idxI}"][data-j="${idxJ}"]`
      );

      elNegs.classList.remove("hidden");
      elNegs.classList.add("shown");
      elNegs.innerText = board[idxI][idxJ].minesAroundCount;
      if (elNegs.innerText === "0") elNegs.innerText = EMPTY;

      // console.log(elNegs);
      gGame.shownCount += 1;
    }
  }
}

// TODO:
function createTimer() {
  var time = gGame.secsPassed;
}

function renderLevel() {
  var strHTML = "";

  for (var i = 0; i < gLevels.length; i++) {
    strHTML += `<button class="btn-${gLevels[i].id}" onclick="setLevel(${gLevels[i].boardSize},${gLevels[i].mineNums})">${gLevels[i].name}</button>\n`;
  }
  var btns = document.querySelector(".buttons");

  btns.innerHTML = strHTML;
}

function setLevel(i, size, mines) {
  gLevel.size = size;
  gLevel.mines = mines;

  var btn = document.querySelector(`.btn-${gLevels[i].id}`);
  console.log(btn);
}
