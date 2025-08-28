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
      console.log('DB Connection Successfily Openings');
  } catch (err) {
    if (process.env.NODE_ENV === 'dev') console.log(err);
  }
};
connectDB();
const openingsSchema = new mongoose.Schema({
  position: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  moves: {
    type: String,
    unique: true,
    required: true,
  },
});
const Openings = mongoose.model('Openings', openingsSchema);
module.exports = Openings;
