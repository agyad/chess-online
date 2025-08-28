const usersModels = require('./../models/usersModels');
const gamesModels = require('./../models/gamesModels');
const jwt = require('jsonwebtoken');

exports.addToLobby = async (socket) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    const token = cookies
      ?.split(';')
      .find((c) => c.trim().startsWith('jwt='))
      ?.split('=')[1];
    const decod = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usersModels.findById(decod._id);
    if (!user) {
      socket.disconnect(true);
    } else return { socket, token, username: user.username };
  } catch (err) {
    throw err;
  }
};
exports.startGame = async (p1, p2) => {
  const game = await new gamesModels({
    white: p1.username,
    black: p2.username,
  }).save();
  const room = game._id.toString();
  const user1 = await usersModels.findOne({ username: p1.username });
  const user2 = await usersModels.findOne({ username: p2.username });
  await usersModels.findByIdAndUpdate(
    user1._id,
    {
      $push: { games: room },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  await usersModels.findByIdAndUpdate(
    user2._id,
    {
      $push: { games: room },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  p1.socket.join(room), p2.socket.join(room);
  p1.socket.emit(
    'get-information-game',
    room,
    user1.username,
    user2.username,
    'white',
    user1.rate,
    user2.rate
  );
  p2.socket.emit(
    'get-information-game',
    room,
    user2.username,
    user1.username,
    'black',
    user2.rate,
    user1.rate
  );
};
exports.checkmate = async (room, ConnectionInformation, moves) => {
  try {
    let winner = 'black';
    if (ConnectionInformation.orientation === 'black') winner = 'white';
    await gamesModels.findByIdAndUpdate(
      room,
      { winner, moves, status: true },
      {
        new: true,
      }
    );
    await usersModels.findOneAndUpdate(
      {
        username: ConnectionInformation.myname,
      },
      { $inc: { loss: 1, rate: -10 } },
      {
        new: true,
        runValidators: true,
      }
    );
    await usersModels.findOneAndUpdate(
      {
        username: ConnectionInformation.opponentname,
      },
      { $inc: { wins: 1, rate: +10 } },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
exports.drew = async (room, ConnectionInformation, moves) => {
  try {
    await gamesModels.findByIdAndUpdate(
      room,
      { winner: 'drew', moves, status: true },
      {
        new: true,
      }
    );
    await usersModels.findOneAndUpdate(
      {
        username: ConnectionInformation.myname,
      },
      { $inc: { drew: 1 } },
      {
        new: true,
        runValidators: true,
      }
    );
    await usersModels.findOneAndUpdate(
      {
        username: ConnectionInformation.opponentname,
      },
      { $inc: { drew: 1 } },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};
