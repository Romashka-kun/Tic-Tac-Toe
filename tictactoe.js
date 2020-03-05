'use strict';

const svg = (() => {
  const _base = (() => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.setAttribute('height', '100%');
    element.setAttribute('width', '100%');
    element.setAttribute('viewBox', '0 0 120 120');

    return element;
  })();

  const _setAttributes = (attrs, element) => {
    for (const key in attrs) element.setAttribute(key, attrs[key]);
  };

  const _createShape = (attrs, shape) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', shape);
    _setAttributes(attrs, element);
    element.classList.add('mark', 'mark__animation');
    const node = _base.cloneNode();
    node.appendChild(element);

    return node;
  };

  const circle = (() => {
    const attributes = {
      stroke: 'black',
      'stroke-width': 10,
      'stroke-linecap': 'round',
      fill: 'transparent',
      r: 50,
      cx: 60,
      cy: 60
    };

    return _createShape(attributes, 'circle');
  })();

  const cross = (() => {
    const attributes = {
      stroke: 'black',
      'stroke-width': 10,
      'stroke-linecap': 'round',
      d: 'M14,14 L106,106 M106,14 L14,106'
    };

    return _createShape(attributes, 'path');
  })();

  return { circle, cross };

})();

const gameboard = (function() {
  let _board = Array.from({ length: 9 }).map(() => null);
  const addMark = (i, mark) => _board[i] = mark;
  const reset = () => _board = _board.map(() => null);
  const isFilled = () => _board.every(cell => cell !== null);
  const isFinished = i => {

    const row = Math.floor(i / 3) * 3;
    const col = i % 3;

    if (_board[row] === _board[row + 1] && _board[row] === _board[row + 2]) {
      return true;
    }
    if (_board[col] === _board[col + 3] && _board[col] === _board[col + 6]) {
      return true;
    }
    if (i % 2 === 0 && _board[4] !== null) {
      if (_board[0] === _board[4] && _board[0] === _board[8]) return true;
      if (_board[2] === _board[4] && _board[2] === _board[6]) return true;
    }

    return false;

  };

  return { addMark, reset, isFilled, isFinished, _board };

})();

const player = name => {
  let _score = 0;

  const getScore = () => _score;
  const increaseScore = () => _score++;

  return { name, getScore, increaseScore };
};

const displayController = (function() {
  const board = document.querySelectorAll('.game-board__cell');
  const p1Score = document.querySelector('.scoreboard__p1 .scoreboard__score');
  const p2Score = document.querySelector('.scoreboard__p2 .scoreboard__score');
  const msgTable = document.querySelector('.message-table');
  const restart = document.querySelector('.restart');
  const line = document.querySelector('game-board__winner-line');

  const player1 = player('Player 1');
  const player2 = player('Player 2');

  let isOver = true;
  const cross = { shape: svg.cross, value: true };
  const circle = { shape: svg.circle, value: false };
  let mark = cross;
  let currentPlayer = player1;

  const toggleGameState = () => {
    isOver = !isOver;
  };

  const restartGame = () => {
    toggleGameState();
    gameboard.reset();
    board.forEach(cell => cell.textContent = '');
    msgTable.textContent = 'Start game or choose mode';
  };

  const drawLine = () => {


  };

  const gameOver = player => {
    player.increaseScore();
    if (player === player1) {
      p1Score.textContent = player.getScore();
    } else {
      p2Score.textContent = player.getScore();
    }
    msgTable.textContent = `${player.name} has won!`;
  };

  const togglePlayer = () => {
    mark = mark.value ? circle : cross;
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    msgTable.textContent = `${currentPlayer.name}'s turn`;
  };

  const render = (cell, i, mark) => {
    cell.appendChild(mark.shape.cloneNode(true));
    gameboard.addMark(i, mark.value);
  };

  const turn = (cell, i) => {
    if (!cell.hasChildNodes() && isOver) {
      render(cell, i, mark);

      if (gameboard.isFinished(i)) {
        // провести линию
        gameOver(currentPlayer);
        toggleGameState();
        return;
      }
      if (gameboard.isFilled()) {
        msgTable.textContent = 'Tie!';
        toggleGameState();
        return;
      }

      togglePlayer();
    }
  };


  board.forEach((cell, i) =>
    cell.addEventListener('click', turn.bind(this, cell, i))
  );

  restart.addEventListener('click', restartGame);

})();
