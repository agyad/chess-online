const path = require('path');
exports.GetBoard = async (req, res) => {
  if (!req.IS_LOGED) {
    return res.redirect('/chessinarabic/signup');
  }
  res.status(200).sendFile(path.join(__dirname, '/../public/board.html'));
};
