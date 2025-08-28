const mongoose = require('mongoose');
const hashPassword = require('./../utilities/hashPassword');
const validator = require('validator');

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
      console.log('DB Connection Successfily Users');
  } catch (err) {
    if (process.env.NODE_ENV === 'dev') console.log(err);
  }
};
connectDB();

// 2- Config Schema
const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'user must have name '],
      maxlength: [20, 'username length should be less then 20 '],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'user must have email '],
      validate: [validator.isEmail, '({VALUE})is not a vaild email '],
    },
    password: {
      type: String,
      required: [true, 'user must have password '],
      select: false,
      minlength: [8, 'password length must be 8 at least'],
    },
    rate: {
      type: Number,
      default: 600,
    },
    games: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    wins: {
      type: Number,
      default: 0,
    },
    loss: {
      type: Number,
      default: 0,
    },
    drew: {
      type: Number,
      default: 0,
    },
    loged: {
      type: [Date],
    },
    passwordchangedat: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 3- Virtual Documents
usersSchema.virtual('WinsRate').get(function () {
  if (this.wins === 0) return 0;
  return 100 / ((this.wins + this.loss + this.drew) / this.wins); // calculate WinsRate
});

// 4- Pre-Hook
usersSchema.pre('findOneAndUpdate', hashPassword.findOneAndUpdate);
usersSchema.pre('save', hashPassword.save);

// 5- Creating Module Collection ('Users')
const Users = mongoose.model('Users', usersSchema);
module.exports = Users;
