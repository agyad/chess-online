const path = require('path');
const hashPassword = require('./../utilities/hashPassword');
const jwt = require('jsonwebtoken');
const usersModels = require('./../models/usersModels');
exports.loginPage = (req, res) => {
  if (req.IS_LOGED) {
    return res.redirect('/chessinarabic');
  }
  const ResponePath = path.join(__dirname, '/../public/login.html');
  res.status(200).sendFile(ResponePath);
};
exports.loging = async (req, res) => {
  if (req.IS_LOGED) {
    return res.redirect('/chessinarabic');
  }
  try {
    // 1 - find user
    const user = await usersModels
      .findOne({ username: req.body.username })
      .select('+password');
    if (user) {
      // 2 - compare password
      const password = await hashPassword.compare(
        req.body.password,
        user.password
      );
      if (password) {
        // 3 - create token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN * 1,
        });
        // 4 -  send token
        return res
          .cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 60,
          })
          .status(200)
          .json({
            status: true,
            data: {
              token,
              message: 'Login successful 🎉',
            },
          });
      }
    }
    res.status(400).json({
      status: false,
      data: {
        message: 'wrong password or username',
      },
    });
  } catch (err) {
    throw err;
  }
};
