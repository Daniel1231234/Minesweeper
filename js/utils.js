"use strict";

function createMat(ROWS) {
  var mat = [];

  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < ROWS[i]; j++) {
      row.push(EMPTY);
    }
    mat.push(row);
  }
  return mat;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderEmoji(value) {
  var elBtn = document.querySelector(".btn-play-again");
  elBtn.innerText = value;
}

function renderRestartButton(emoji) {
  var elLife = document.querySelector(".btn-play-again");
  elLife.innerText = emoji;
}

function createLivesCounter(number) {
  var elCounter = document.querySelector(".live span");
  elCounter.innerHTML = number;
}
