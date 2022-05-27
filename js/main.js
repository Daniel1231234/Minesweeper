"use strict";

//* TIMER, LEVELS, EMOJI-RESETGAME

const EMPTY = "";

// DOM ELEMENTS
const MINE_IMG = `💣`;
const FLAG_IMG = `🚩`;

// global variables
var gLives;
var gClickCount;
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

var gLevels = [
  { id: 0, name: "Easy", boardSize: 4, mineNums: 2 },
  { id: 1, name: "Medium", boardSize: 8, mineNums: 12 },
  { id: 2, name: "Hard", boardSize: 12, mineNums: 30 },
];

// functions

function init() {
  gGame.inOn = true;
  gBoard = buildBoard(gLevel.size);

  gClickCount = 0;
  gLives = 3;

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

      var mine = cell.isMine ? MINE_IMG : EMPTY;

      var dataAttrib = `data-i=${i} data-j=${j}`;

      strHTML += `\t<td ${dataAttrib}
        class="cell ${className}" 
        onclick="cellClicked(this,${i},${j})" 
        oncontextmenu="cellMarked(this,event,${i},${j})">\n
        <span>${mine}</span>`;

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
  var randMines = 0;

  while (randMines < levelMines) {
    var celli = getRandomInt(0, gLevel.size - 1);
    var cellj = getRandomInt(0, gLevel.size - 1);
    if (celli === i && cellj === j) continue;
    gBoard[celli][cellj].isMine = true;
    randMines++;
  }
}

function cellClicked(elCell, i, j) {
  if (elCell.innerText === FLAG_IMG) return;
  if (!gGame.isOn) {
    getRandomMines(gLevel.mines, i, j);
    // createTimer();
    gGame.isOn = true;
  }
  var cell = gBoard[i][j];
  // var elCellContent = elCell.querySelector("td span");

  if (cell.isShown) return;
  if (!cell.isShown) {
    cell.isShown = true;
    elCell.classList.remove("hidden");
    elCell.classList.add("shown");

    // elCellContent.style.visibility = "visible";

    gGame.shownCount++;
  }

  var numOfMinesNeg = setMinesNegsCount(i, j);
  cell.minesAroundCount = numOfMinesNeg;
  elCell.innerText = cell.minesAroundCount;

  console.log("shown: ", gGame.shownCount);

  if (cell.isMine) {
    elCell.innerText = MINE_IMG;
    // looseGame();
  }

  if (cell.minesAroundCount === 0 && !cell.isMine) {
    // console.log("its 0");
    elCell.innerText = EMPTY;
    expandShown(elCell, i, j);
  }
}

function cellMarked(elCell, ev, i, j) {
  ev.preventDefault();

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

  // if (gGame.markedCount === gLevel.mines) gameWin();
  console.log("flagged: ", gGame.markedCount);
}

function looseGame() {
  gGame.isOn = false;
  for (var i = 0; i < gLevel.size; i++) {
    for (var j = 0; j < gLevel.size; j++) {
      var cell = gBoard[i][j];
      if (!cell.isMine) continue;

      var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
      elCell.innerText = MINE_IMG;
    }
  }
  renderRestartButton("☠");
}

function renderRestartButton(emoji) {
  var elLife = document.querySelector(".btn-play-again");
  elLife.innerText = emoji;
}

function expandShown(elCell, i, j) {
  // var elCellContent = elCell.querySelector("td span");
  for (var idxI = i - 1; idxI <= i + 1; idxI++) {
    if (idxI < 0 || idxI > gLevel.size - 1) continue;

    for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
      if (idxI === i && idxJ === j) continue;
      if (idxJ < 0 || idxJ > gLevel.size - 1) continue;

      if (gBoard[idxI][idxJ].isMarked) continue;
      if (gBoard[idxI][idxJ].isShown) continue;
      gBoard[idxI][idxJ].isShown = true;
      gGame.shownCount++;

      console.log(gGame.shownCount);
      var elNegs = document.querySelector(
        `[data-i="${idxI}"][data-j="${idxJ}"]`
      );

      elNegs.classList.remove("hidden");
      elNegs.classList.add("shown");
      // elCellContent.style.visibility = "visible";
      elCell.innerText = setMinesNegsCount(i, j);
    }
  }
}

function renderLevel() {
  var strHTML = "";

  for (var i = 0; i < gLevels.length; i++) {
    strHTML += `<button class="btn-${gLevels[i].id}" onclick="setLevel(${gLevels[i].boardSize},${gLevels[i].mineNums})">${gLevels[i].name}</button>\n`;
  }
  var btns = document.querySelector(".buttons");
  console.log(btns);
  btns.innerHTML = strHTML;
}

function setLevel(i, size, mines) {
  gLevel.size = size;
  gLevel.mines = mines;

  var btn = document.querySelector(`.btn-${gLevels[i].id}`);
  console.log(btn);
}

// function createTimer() {
//   var elTimer = document.querySelector(".timer span");
//   var counter = 0;
//   gInterval = setInterval(() => {
//     counter += 0.01;
//     elTimer.innerHTML = "Timer:   " + counter.toFixed(3);
//   }, 10);
// }

function createLivesCounter(number) {
  var elCounter = document.querySelector(".live span");

  elCounter.innerHTML = number;
}
