"use strict";

const EMPTY = "";

// DOM ELEMENTS
const MINE_IMG = `💣`;
const FLAG_IMG = `🚩`;

// global variables
var gLives;
var gBoard;
var gInterval;

// initiale conditions
var gLevel = {
  size: 4, // 8 / 12
  mines: 2, // 12 // 30
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  minedCellCount: 0,
};

// functions

function init() {
  gGame.inOn = false;
  gBoard = buildBoard(gLevel.size);
  renderEmoji("😎");
  gLives = 3;
  createLivesCounter(3);
  renderBoard(gBoard);
}

function buildBoard(size) {
  var board = createMat(size);

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var cell = {
        isShown: false,
        isMine: false,
        isMarked: false,
        minesAroundCount: 0,
      };
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
      className += cell.isShown ? "shown " : "hidden ";
      className += cell.isMine ? "mine " : EMPTY;
      className += cell.isMarked ? "flag " : EMPTY;

      var dataAttrib = `data-i=${i} data-j=${j}`;

      strHTML += `\t<td ${dataAttrib}
        class="cell ${className}" 
        onclick="cellClicked(this,${i},${j})" 
        oncontextmenu="cellMarked(this,event,${i},${j})">\n
        `;

      strHTML += `\t</td>\n`;
    }
    strHTML += `</tr>\n`;
  }

  var elBoard = document.querySelector("table");
  elBoard.innerHTML = strHTML;
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

function getRandomMines(levelMines, i, j) {
  var randMines = [];
  var counter = 0;

  while (counter < gLevel.mines) {
    var celli = getRandomInt(0, gLevel.size - 1);
    var cellj = getRandomInt(0, gLevel.size - 1);
    var minePos = gBoard[celli][cellj];

    if (celli === i && cellj === j) continue;
    minePos.isMine = true;

    if (randMines.includes(minePos)) continue;
    randMines.push(minePos);
    counter++;
  }
  // console.log(randMines);
}

function checkWin() {
  if (gLevel.size ** 2 - gGame.shownCount === gGame.markedCount) {
    console.log("WIN");
    winGame();
  }
}

function cellClicked(elCell, i, j) {
  var elBtn = document.querySelector(".btn-play-again");
  if (elBtn.innerText === "💀") return;

  checkWin();

  if (elCell.innerText === FLAG_IMG) return;
  if (!gGame.isOn) {
    getRandomMines(gLevel.mines, i, j);

    createTimer();

    gGame.isOn = true;
  }

  renderEmoji("😎");

  var cell = gBoard[i][j];

  if (cell.isShown) return;
  if (!cell.isShown) {
    cell.isShown = true;
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");

    gGame.shownCount++;
  }

  var numOfMinesNeg = setMinesNegsCount(i, j);

  cell.minesAroundCount = numOfMinesNeg;

  elCell.innerText = cell.minesAroundCount;

  // console.log("shown: ", gGame.shownCount);

  if (cell.isMine) {
    gLives--;
    elCell.innerText = MINE_IMG;
    renderEmoji("😩");
    createLivesCounter(gLives);
    if (gLives === 0) {
      clearInterval(gInterval);

      looseGame();
    }
  }

  if (cell.minesAroundCount === 0 && !cell.isMine) {
    elCell.innerText = EMPTY;
    expandShown(elCell, i, j);
  }
}

function cellMarked(elCell, ev, i, j) {
  ev.preventDefault();

  var elBtn = document.querySelector(".btn-play-again");
  if (elBtn.innerText === "💀" || elBtn.innerText === "🥇") return;

  if (!gGame.isOn) return;

  if (elCell.classList.contains("shown")) {
    return;
  }

  var cell = gBoard[i][j];

  if (cell.isMarked === false) {
    cell.isMarked = true;
    elCell.innerText = FLAG_IMG;
    gGame.markedCount++;
  } else {
    cell.isMarked = false;
    elCell.innerText = EMPTY;
    gGame.markedCount--;
  }

  checkWin();

  console.log("flagged: ", gGame.markedCount);
}

function expandShown(elCell, i, j) {
  for (var idxI = i - 1; idxI <= i + 1; idxI++) {
    if (idxI < 0 || idxI > gLevel.size - 1) continue;

    for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
      if (idxI === i && idxJ === j) continue;
      if (idxJ < 0 || idxJ > gLevel.size - 1) continue;

      if (gBoard[idxI][idxJ].isMarked) continue;
      if (gBoard[idxI][idxJ].isShown) continue;
      gBoard[idxI][idxJ].isShown = true;
      gGame.shownCount++;

      console.log("shown: ", gGame.shownCount);
      var elNegs = document.querySelector(
        `[data-i="${idxI}"][data-j="${idxJ}"]`
      );

      elNegs.classList.remove("hidden");
      elNegs.classList.add("shown");

      elCell.innerText = setMinesNegsCount(i, j);
    }
  }
}

function looseGame() {
  renderEmoji("💀");

  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      var cell = gBoard[i][j];
      if (!cell.isMine) continue;

      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      elCell.innerText = MINE_IMG;
    }
  }
}

function restartGame(elBtn) {
  clearInterval(gInterval);
  location.reload();
}

function createTimer() {
  var elTimer = document.querySelector(".timer span");
  var counter = 0;
  gInterval = setInterval(() => {
    counter += 0.01;
    elTimer.innerHTML = "Timer:   " + counter.toFixed(3);
  }, 10);
}

function setLevel(size, mines) {
  gLevel.size = size;
  gLevel.mines = mines;
  removeTimer();

  init();
  gGame.isOn = false;
}

function removeTimer() {
  var elTimer = document.querySelector(".timer span");
  elTimer.innerText = EMPTY;
  clearInterval(gInterval);
}

function winGame() {
  console.log("winning");
  renderEmoji("🥇");
  removeTimer();
}
