const usersModels = require('./../models/usersModels');
const superadminModels = require('../models/SuperAdminModels');
const jwt = require('jsonwebtoken');
exports.isloged = async (req, res, next) => {
  try {
    req.IS_LOGED = false;
    const token = req.cookies.jwt;
    if (!token) {
      return next();
    }
    const decod = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usersModels.findById(decod._id);
    if (!user) {
      return res.clearCookie('jwt').redirect('/chessinarabic');
    }
    if (user.passwordchangedat * 1000 > decod.iat * 1) {
      return res.clearCookie('jwt').redirect('/chessinarabic');
    }
    req.CURRENTUSER = user;
    req.IS_LOGED = true;
    next();
  } catch (err) {
    return res.clearCookie('jwt').redirect('/chessinarabic');
  }
};
exports.isAdminloged = async (req, res, next) => {
  try {
    req.IS_ADMIN_LOGED = false;
    const token = req.cookies.admin;
    if (!token) {
      return next();
    }
    const decod = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await superadminModels.findById(decod._id);
    if (!admin) {
      return res.clearCookie('admin').redirect('/chessinarabic');
    }

    if (admin.passwordchangedat * 1000 > decod.iat * 1) {
      return res.clearCookie('admin').redirect('/chessinarabic');
    }
    req.IS_ADMIN_LOGED = true;
    next();
  } catch (err) {
    return res.clearCookie('admin').redirect('/chessinarabic');
  }
};
