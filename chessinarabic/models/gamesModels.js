const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV == 'dev')
      console.log('DB Connection Successfily games');
  } catch (err) {
    if (process.env.NODE_ENV === 'dev') console.log(err);
  }
};
connectDB();
const gamesSchema = new mongoose.Schema({
  status: {
    type: String,
    default: false,
  },
  winner: String,
  opening: String,
  moves: String,
  white: String,
  black: String,
  CreatedAT: {
    type: Date,
    default: Date.now(),
  },
});
const games = mongoose.model('games', gamesSchema);
module.exports = games;
