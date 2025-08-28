const usersModels = require('./../models/usersModels');
const jwt = require('jsonwebtoken');
const path = require('path');
exports.getpage = async (req, res) => {
  if (!req.IS_LOGED) return res.redirect('/chessinarabic');
  res.status(200).sendFile(path.join(__dirname, '../public/me.html'));
};
exports.getdata = async (req, res) => {
  if (!req.IS_LOGED) return res.redirect('/chessinarabic');
  try {
    const token = req.cookies.jwt;

    const decod = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usersModels.findById(decod._id);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({
      status: false,
      data: {
        message: err.message,
      },
    });
  }
};
