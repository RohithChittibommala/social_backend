const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Jwt_Secret } = require("../../variables.js");
const { validationResult } = require("express-validator");
module.exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .json({ userExist: "user with email already exists please login" });
    const user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ err });
  }
};
module.exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ userExist: "no such user with mail exists" });
    const doesPasswordMatch = await user.comparePasswords(password);
    if (!doesPasswordMatch)
      return res.status(400).json({ password: "invalid password" });
    const token = jwt.sign({ _id: user._id }, Jwt_Secret);
    user.password = null;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ err });
  }
};
