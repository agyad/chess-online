const path = require('path');
const usersModels = require('./../models/usersModels');

exports.signupPage = (req, res) => {
  if (req.IS_LOGED) {
    return res.redirect('/chessinarabic');
  }

  const respath = path.join(__dirname, '../public/signup.html');
  res.status(200).sendFile(respath);
};
exports.signingup = async (req, res) => {
  if (req.IS_LOGED) {
    return res.redirect('/chessinarabic');
  }
  try {
    const { username, password, email } = req.body;
    const user = await new usersModels({ username, password, email }).save();

    res.status(201).json({
      status: true,
      data: {
        message: 'Account Have Been Craeted successful 🎉',
      },
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      data: {
        message: err.message,
      },
    });
  }
};
