const gamesModels = require('./../models/gamesModels');
const path = require('path');
const fs = require('fs');
const PagePath = path.join(__dirname, '../public/game.html');
let GamePage = fs.readFileSync(PagePath, 'utf-8');
exports.game = async (req, res) => {
  if (!req.IS_LOGED) {
    return res.redirect('/chessinarabic/signup');
  }
  try {
    const id = req.params.id;
    if (id) {
      const game = await gamesModels.findOne({ _id: id });
      if (game) {
        let ResponeFile = GamePage.replace(/%{WHITE}%/g, game.white);
        ResponeFile = ResponeFile.replace(/%{BLACK}%/g, game.black);
        ResponeFile = ResponeFile.replace(/%{WINNER}%/g, game.winner);
        ResponeFile = ResponeFile.replace(/%{OPENING}%/g, game.opening);
        ResponeFile = ResponeFile.replace(/%{MOVES}%/g, game.moves);

        return res.status(200).send(ResponeFile);
      }
    }
    return res
      .status(400)
      .sendFile(path.join(__dirname, '/../public/404.html'));
  } catch (err) {
    console.log(err.message);
    return res.redirect('/chessinarabic');
  }
};
