const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");
const defaultImageUrl = `https://images.unsplash.com/photo-1571066470962-f10fcf2fdf9e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nfGVufDB8MnwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`;
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
