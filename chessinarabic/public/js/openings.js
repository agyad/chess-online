import { Chess } from '../libs/chess.js/chess.js';

let resultsID = document.getElementById('results');
let nextBtn = document.getElementById('nextBtn');
let leftArrow = document.getElementById('leftArrow');
let rightArrow = document.getElementById('rightArrow');

let board = null;
let game = new Chess();
let moves = [game.pgn()];
let nextcurser = 0;
let indexmoves = 0;
leftArrow.addEventListener('click', async () => {
  if (indexmoves) {
    game.load_pgn(moves[indexmoves - 1]);
    await openingsData(0);
    board.position(game.fen());
    indexmoves--;
    nextcurser = 0;
  }
});
rightArrow.addEventListener('click', async () => {
  if (indexmoves + 1 < moves.length) {
    game.load_pgn(moves[indexmoves + 1]);
    await openingsData(0);
    board.position(game.fen());
    indexmoves++;
    nextcurser = 0;
  }
});
nextBtn.addEventListener('click', async () => {
  await openingsData(nextcurser);
  console.log(nextcurser);
});
addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowLeft' && indexmoves) {
    game.load_pgn(moves[indexmoves - 1]);
    await openingsData(0);
    board.position(game.fen());
    indexmoves--;
    nextcurser = 0;
  }
});
addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowRight' && indexmoves + 1 < moves.length) {
    game.load_pgn(moves[indexmoves + 1]);
    await openingsData(0);
    board.position(game.fen());
    indexmoves++;
    nextcurser = 0;
  }
});

const openingsData = async (curser) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:3000/chessinarabic/openings/data?moves=${game.pgn()}&curser=${curser}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const searchResult = await res.json();
    resultsID.innerHTML = ' ';
    if (searchResult.status && searchResult.data.openings.length) {
      const data = searchResult.data.openings;
      data.forEach((element) => {
        const child = document.createElement('div');
        child.classList.add(
          'bg-purple-100',
          'text-gray-800',
          'px-3',
          'py-2',
          'rounded-lg',
          'hover:opacity-90',
          'active:scale-95',
          'transition',
          'cursor-pointer'
        );
        child.textContent = element.name;
        child.addEventListener('click', async () => {
          game.load_pgn(element.moves);
          board.position(game.fen());
          moves.push(element.moves);
          indexmoves = moves.length - 1;
          nextcurser = 0;
          await openingsData(0);
        });
        resultsID.appendChild(child);
      });
      nextcurser = searchResult.data.nextcurser;
      return;
    }
  } catch (err) {
    alert('somethis went wrong ' + err.message);
  }
  const child = document.createElement('div');
  child.textContent = 'nothing found';
  resultsID.appendChild(child);
};

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (
    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

async function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q', // NOTE: always promote to a queen for example simplicity
  });

  if (move === null) return 'snapback';
  await openingsData(0);
}

function onSnapEnd() {
  board.position(game.fen());
  moves.push(game.pgn());
  indexmoves = moves.length - 1;
  nextcurser = 0;
}

board = Chessboard('myBoard', {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
});
