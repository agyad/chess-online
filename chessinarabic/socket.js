// socket.js
const { Server } = require('socket.io');
const socketControllers = require('./controllers/sockectControllers');
let io;
function setupSocket(server) {
  io = new Server(server);
  var Players = [];
  io.on('connection', async (socket) => {
    socket.on('chat-message', (msg, room) => {
      socket.to(room).emit('chat-message', msg);
    });
    socket.on('offer-draw', (room) => {
      socket.to(room).emit('offer-draw');
    });
    socket.on('disconnect', () => {
      if (Players.length && Players[0].socket === socket) Players.shift();
    });
    try {
      const Player = await socketControllers.addToLobby(socket);
      Players.push(Player);
    } catch (err) {
      socket.disconnect(true);
    }
    if (Players.length >= 2) {
      socketControllers.startGame(Players[0], Players[1]);
      Players.shift(), Players.shift();
    }
    socket.on('make-move', async (room, source, target, promotion) => {
      socket.to(room).emit('make-move', room, source, target, promotion);
    });
    socket.on(
      'checkmate-timeout',
      async (room, ConnectionInformation, moves) => {
        await socketControllers.checkmate(room, ConnectionInformation, moves);
        io.to(room).emit('game-over', false); // false means draw
        const Socket = await io.in(room).fetchSockets();
        Socket.forEach((element) => {
          element.leave(room);
        });
      }
    );
    socket.on('draw', async (room, ConnectionInformation, moves) => {
      await socketControllers.drew(room, ConnectionInformation, moves);
      io.to(room).emit('game-over', true); // true which means checkmate or time
      const Socket = await io.in(room).fetchSockets();
      Socket.forEach((element) => {
        element.leave(room);
      });
    });
  });
}
module.exports = setupSocket;
