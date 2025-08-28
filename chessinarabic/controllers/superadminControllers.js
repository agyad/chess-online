const superadminModels = require('../models/SuperAdminModels');
const usersModels = require('../models/usersModels');
const path = require('path');
const hashPassword = require('./../utilities/hashPassword');
const jwt = require('jsonwebtoken');
exports.test = async (req, res, next) => {
  console.log('enter');
  next();
};
exports.loginpage = async (req, res) => {
  const ResponePath = path.join(__dirname, '/../public/superadminlogin.html');
  console.log(ResponePath);
  res.status(200).sendFile(ResponePath);
};
exports.loging = async (req, res) => {
  try {
    // 1 - find user
    const user = await superadminModels.findOne({
      username: req.body.username,
    });
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
        console.log(token);
        // 4 -  send token
        return res
          .cookie('admin', token, {
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
    console.log(err);
    throw err;
  }
};
exports.superadminpage = async (req, res) => {
  if (!req.IS_ADMIN_LOGED) return res.redirect('/chessinarabic');
  const ResponePath = path.join(__dirname, '/../public/superadmin.html');
  res.status(200).sendFile(ResponePath);
};

exports.createUser = async (req, res) => {
  if (!req.IS_ADMIN_LOGED) return res.redirect('/chessinarabic');

  try {
    const { username, password, email } = req.body;
    const user = await new usersModels({ username, password, email }).save();
    res.status(201).json({
      status: true,
      data: {
        user,
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
exports.removeUser = async (req, res) => {
  if (!req.IS_ADMIN_LOGED) return res.redirect('/chessinarabic');
  try {
    const ID = req.params.id;
    const user = await usersModels.findByIdAndDelete(ID);
    res.status(204).json({
      status: true,
      message: 'user ${user.username} have been deleted ',
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message,
    });
  }
};
exports.readUser = async (req, res) => {
  if (!req.IS_ADMIN_LOGED) return res.redirect('/chessinarabic');

  try {
    const ID = req.params.id;
    const user = await usersModels.findById(ID);
    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message,
    });
  }
};
