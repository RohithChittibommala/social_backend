const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Jwt_Secret } = require("../../variables.js");

module.exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).send({ error: "user already exists" });
    const user = new User({ name, email, password });
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(err.message || err);
    res.status(400).json({ error });
  }
};
module.exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ err: "no such user with mail exists" });
    const doesPasswordMatch = await user.comparePasswords(password);
    if (!doesPasswordMatch) return res.json({ error: "invalid password" });
    const token = jwt.sign({ _id: user._id }, Jwt_Secret);
    res.json({ token });
  } catch (err) {
    console.log(err.message || err);
    res.status(400).json({ err });
  }
};
