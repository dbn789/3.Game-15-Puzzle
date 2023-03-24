// создаем список полей (ячеек)
const cellArray = document.querySelectorAll(".cell");
// создаем объект "игровое поле"
const fieldArray = document.querySelector("#field-puzzle");
//создаем обьект кнопка "Новая игра"
const newGameButton = document.querySelector("#new-game");
//создаем обьект "Табло - количество ходов"
const score = document.querySelector("#score");
//создаем обьект "Табло времени игры"
const gameTime = document.querySelector("#time");
//создаем обьект "ПОБЕДА"
const gameVictory = document.querySelector("#victory");
// создаем двумерный массив полей 4 на 4 из списка полей
const stateArray = [];
for (let i = 0; i < cellArray.length; i += 4)
  if (
    cellArray[i] !== undefined &&
    cellArray[i + 1] !== undefined &&
    cellArray[i + 2] !== undefined &&
    cellArray[i + 3] !== undefined
  )
    stateArray.push([
      cellArray[i],
      cellArray[i + 1],
      cellArray[i + 2],
      cellArray[i + 3],
    ]);

// функция рендеринга - обновление полей после клика
function render(fieldArray, stateArray) {
  stateArray.forEach((row) => {
    row.forEach((column) => {
      fieldArray.appendChild(column);
    });
  });
}
// функция перемешивания полей
function mixer() {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  stateArray.forEach((row) => {
    row.forEach((column) => {
      const index = Math.round(Math.random() * (digits.length - 1));
      if (digits[index] === undefined) column.innerText = "";
      else column.innerText = digits[index];
      render(fieldArray, stateArray);
      digits.splice(index, 1);
    });
  });
}

// функция проверки победы в игре
function isWinner() {
  let counter = 1;
  stateArray.forEach((row) => {
    row.forEach((column) => {
      console.log(+column.innerText);
      if (+column.innerText === counter) counter++;
    });
  });
  if (counter === 16) return true;
  else return false;
}
// обработчик события "клик по кнопке Новая игра"
newGameButton.addEventListener("click", () => {
  location.reload();
});
// обработчик событий  "клик мышью по игровому полю"
fieldArray.addEventListener("click", (event) => {
  // переменная target показывает на каком поле (ячейке) произошло событие "клик"
  const target = event.target;
  let x, y;
  let nullX, nullY;
  // перебор ячеек и присвоение координат для ячейки на которой произошло событие
  // перебор ячеек и определение пустой ячейки
  stateArray.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      if (column === target) {
        x = rowIndex;
        y = columnIndex;
      }
      if (column.innerText === "") {
        nullX = rowIndex;
        nullY = columnIndex;
      }
    });
  });
  // проверка, что ячейка на которой произошло событие, является соседней с пустой
  if (
    ((x + 1 === nullX || x - 1 === nullX) && y === nullY) ||
    ((y + 1 === nullY || y - 1 === nullY) && x === nullX)
  ) {
    // замена пустой ячейки на ячейку, на которой произошло событие
    const temp = stateArray[x][y];
    stateArray[x][y] = stateArray[nullX][nullY];
    stateArray[nullX][nullY] = temp;
    score.innerText++;
    // вызов функции рендеринга
    render(fieldArray, stateArray);
    // проверка решения задачи
    if (isWinner()) {
      const resultTime = gameTime.innerText;
      gameVictory.style.display = "flex";
      clearInterval(timer);
      gameTime.innerText = resultTime;
    }
  }
});
mixer();
score.innerText = 0;
let minutes = 0;
let seconds = 0;
gameTime.innerText = `${minutes} : ${seconds}`;
// функция таймера
let timer = setInterval(() => {
  seconds++;
  if (seconds % 60 === 0) {
    seconds = 0;
    gameTime.innerText = `${++minutes} : ${seconds}`;
  } else gameTime.innerText = `${minutes} : ${seconds}`;
}, 1000);
