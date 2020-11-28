const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, minlength: 3, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, min: 4, required: true },
});
userSchema.pre("save", async function (next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();
  //hash the password
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(user.password, salt);
  user.password = password;
  next();
});
userSchema.methods.comparePasswords = function (data) {
  return bcrypt.compare(data, this.password);
};
const User = model("users", userSchema);

module.exports = User;
