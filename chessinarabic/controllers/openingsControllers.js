const path = require('path');
const openingsModel = require('./../models/openingModels');
const { Types } = require('mongoose');
exports.getopeningsPage = async (req, res) => {
  if (!req.IS_LOGED) {
    return res.redirect('/chessinarabic/signup');
  }
  res.status(200).sendFile(path.join(__dirname, '/../public/openings.html'));
};
exports.getresult = async (req, res) => {
  if (!req.IS_LOGED) {
    return res.redirect('/chessinarabic/signup');
  }

  try {
    const moves = ('^' + req.query.moves).trim().split(' ').join('\\s*');
    let openings;
    let curser = req.query.curser;
    if (curser !== '0') {
      openings = await openingsModel
        .find({
          _id: { $gt: new Types.ObjectId(`${curser}`) },
          moves: {
            $regex: moves,
            $options: 'i',
          },
        })
        .sort({
          _id: 1,
        })
        .limit(20);
    } else
      openings = await openingsModel
        .find({
          moves: {
            $regex: moves,
            $options: 'i',
          },
        })
        .sort({
          _id: 1,
        })
        .limit(20);
    res.status(200).json({
      status: true,
      data: {
        openings,
        nextcurser: openings[openings.length - 1]._id,
      },
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
};
