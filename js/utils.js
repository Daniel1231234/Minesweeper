"use strict";

function createMat(ROWS, COLS) {
  var mat = [];

  for (var i = 0; i < ROWS; i++) {
    var row = [];
    for (var j = 0; j < COLS; j++) {
      row.push(EMPTY);
    }
    mat.push(row);
  }
  if (ROWS === COLS) return mat;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
