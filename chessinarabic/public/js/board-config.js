import { Chess } from '../libs/chess.js/chess.js';
const socket = io();
// ID's
var $Name2 = $('#name2');
var $Name1 = $('#name1');
var $Time2 = $('#time2');
var $Time1 = $('#time1');
var $Rate1 = $('#rate1');
var $Rate2 = $('#rate2');
var $ChatSend = $('#chatSend');
var $ChatInput = $('#chatInput');
var $ChatMessages = $('#chatMessages');
var $resignBtn = $('#resignBtn');
var $drawBtn = $('#drawBtn');
var $acceptDraw = $('#acceptDraw');
var $declineDraw = $('#declineDraw');

let board = null;
let game = new Chess();
let room = null;
let myOrientation = 'white';
let ConnectionInformation = {};
let mytime = 60 * 3;
let opponenttime = 60 * 3;
let ACtivePLayer = true; //true maen me and false my oppenant
let intervalid;
let winner = 'white';
let moves = [game.fen()];
let indexmoves = 0;

addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowLeft' && indexmoves) {
    game.load(moves[indexmoves - 1]);
    board.position(game.fen());
    indexmoves--;
  }
});
addEventListener('keydown', async (e) => {
  if (e.key === 'ArrowRight' && indexmoves + 1 < moves.length) {
    game.load(moves[indexmoves + 1]);
    board.position(game.fen());
    indexmoves++;
  }
});

const StartTimer = () => {
  return (intervalid = setInterval(() => {
    if (ACtivePLayer) {
      mytime -= 1;
      if (!mytime) {
        socket.emit(
          'checkmate-timeout',
          room,
          ConnectionInformation,
          game.pgn()
        );
        if (myOrientation[0] === 'w') winner = 'black';
      }
    } else opponenttime -= 1;
    $Time2.html(`${Math.floor(mytime / 60)}:${mytime % 60}`);

    $Time1.html(`${Math.floor(opponenttime / 60)}:${opponenttime % 60}`);
  }, 1000));
};
const showplayers = (myrate, opponentrate, myname, opponentname) => {
  $Rate2.html(`♟️ ${myrate}`);
  $Rate1.html(`♟️ ${opponentrate}`);
  $Name2.html(myname);
  $Name1.html(opponentname);
};
board = Chessboard('myBoard', {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd,
});
function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;
  if (
    (game.turn() === 'w' && piece.startsWith('b')) ||
    (game.turn() === 'b' && piece.startsWith('w')) ||
    game.turn() !== myOrientation[0]
  ) {
    return false;
  }
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q', // always promote to queen
  });

  if (move === null) return 'snapback';

  socket.emit('make-move', room, source, target, 'q');
  ACtivePLayer = !ACtivePLayer;
  winner = myOrientation;
  moves.push(game.fen());
  indexmoves = moves.length - 1;
}

function onSnapEnd() {
  board.position(game.fen());
}
$resignBtn.on('click', () => {
  if (room) {
    winner = myOrientation[0] === 'w' ? 'black' : 'white';
    socket.emit('checkmate-timeout', room, ConnectionInformation, game.pgn());
  }
});
$drawBtn.on('click', () => {
  if (room) {
    socket.emit('offer-draw', room);
  }
});

$ChatSend.on('click', () => {
  const msg = $ChatInput.val().trim();
  if (room && msg) {
    socket.emit('chat-message', msg, room);
    const $elment = $('<div>')
      .addClass(
        'self-end inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-3 py-1 rounded-lg max-w-xs break-words'
      )
      .text(msg);
    $ChatMessages.append($elment);
  }
  $ChatInput.val('');
});
socket.on('chat-message', (msg) => {
  const $elment = $('<div>')
    .addClass(
      'self-start inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-lg max-w-xs break-words'
    )
    .text(msg);
  $ChatMessages.append($elment);
});

socket.on('offer-draw', () => {
  $acceptDraw.removeClass('hidden');
  $declineDraw.removeClass('hidden');
  $drawBtn.addClass('hidden');
  $acceptDraw.on('click', () => {
    socket.emit('draw', room, ConnectionInformation, game.pgn());
    $acceptDraw.addClass('hidden');
    $declineDraw.addClass('hidden');
    $drawBtn.removeClass('hidden');
  });
  $declineDraw.on('click', () => {
    $acceptDraw.addClass('hidden');
    $declineDraw.addClass('hidden');
    $drawBtn.removeClass('hidden');
  });
});

// when server tells us game info
socket.on(
  'get-information-game',
  (gameRoom, myname, opponentname, orientation, myrate, opponentrate) => {
    room = gameRoom;
    myOrientation = orientation;
    ConnectionInformation = { myname, opponentname, orientation };
    board.orientation(orientation);
    board.start();
    game.reset();
    winner = myOrientation;
    ACtivePLayer = myOrientation[0] === game.turn();
    showplayers(myrate, opponentrate, myname, opponentname);
    intervalid = StartTimer();
  }
);
socket.on('make-move', (room, source, target, promotion) => {
  game.move({ from: source, to: target, promotion });
  board.position(game.fen());
  ACtivePLayer = !ACtivePLayer;
  moves.push(game.fen());
  indexmoves = moves.length - 1;
  if (game.game_over()) {
    winner = myOrientation[0] === 'w' ? 'black' : 'white';
    if (game.in_checkmate()) {
      socket.emit('checkmate-timeout', room, ConnectionInformation, game.pgn());
    }
    if (game.in_draw()) {
      socket.emit('draw', room, ConnectionInformation, game.pgn());
    }
  }
});
socket.on('game-over', (draw) => {
  clearInterval(intervalid);
  if (draw) window.alert(`game ended in draw`);
  else window.alert(`${winner} Is The Winner`);
  window.location.href = '/chessinarabic ';
});
socket.on('disconnect', () => {
  window.alert('Something went wrong');
  window.location.href = '/chessinarabic';
});
