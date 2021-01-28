const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");
const defaultImageUrl = `http://res.cloudinary.com/rohith/image/upload/v1611564543/eg0vu5htbsxdaithleu3.jpg`;
const userSchema = new Schema({
  name: { type: String, minlength: 3, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, min: 4, required: true },
  isVerified: { type: Boolean, default: false },
  imageUrl: { type: String, required: false, default: defaultImageUrl },
  followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: Schema.Types.ObjectId, ref: "users" }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.set("timestamps", true);

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
