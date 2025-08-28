const mongoose = require('mongoose');
const hashPassword = require('../utilities/hashPassword');

// 1- Connect DataBase
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);
const connectDB = async () => {
  try {
    const res = await mongoose.connect(DB, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (process.env.NODE_ENV == 'dev')
      console.log('DB Connection Successfily SuperAdmin');
  } catch (err) {
    if (process.env.NODE_ENV === 'dev') console.log(err);
  }
};
connectDB();

// 2- Config Schema
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'user must have name '],
  },
  password: {
    type: String,
    required: [true, 'user must have password '],
    minlength: 8,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// 4- Pre-Hook
usersSchema.pre('save', hashPassword.save);

// 5- Creating Module Collection ('SuperAdmin')
const SuperAdmin = mongoose.model('SuperAdmin', usersSchema);
module.exports = SuperAdmin;
