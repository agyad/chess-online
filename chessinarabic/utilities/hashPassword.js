const bcrypt = require('bcrypt');
exports.findOneAndUpdate = async function (next) {
  if (this._update.password) {
    try {
      this._update.password = await bcrypt.hash(
        this._update.password,
        process.env.BCRYPT_SALT * 1
      );
      this._update.passwordchangedat = Date.now();
      console.log(this._update);
    } catch (err) {
      return next(err);
    }
  }
  next();
};
exports.save = async function (next) {
  try {
    this.password = await bcrypt.hash(
      this.password,
      process.env.BCRYPT_SALT * 1
    );
  } catch (err) {
    throw err;
  }
  next();
};
exports.compare = async (myPlaintextPassword, hash) => {
  try {
    const password = await bcrypt.compare(myPlaintextPassword, hash);
    return password;
  } catch (err) {
    throw err;
  }
};
