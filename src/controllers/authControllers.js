const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Jwt_Secret, api_key } = require("../../variables.js");
const { validationResult } = require("express-validator");
const Token = require("../models/token");
const {
  verifyEmailTemplate,
  forgotPasswordTemplate,
  accountPasswordChanged,
} = require("../utils/emialTemplates");
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: { api_key },
  })
);

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
    const userToken = crypto.randomBytes(24).toString("hex");
    const token = new Token({ email, token: userToken });
    await token.save();
    await transporter.sendMail(
      verifyEmailTemplate(userToken, user.email, user.name)
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ err });
    throw new Error(("Error", err));
  }
};

module.exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .populate("followers", "name _id imageUrl")
      .populate("following", "name _id imageUrl");
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

module.exports.confirmEmail = async (req, res) => {
  try {
    const token = await Token.findOne({
      token: req.params.token,
    });
    const user = await User.findOneAndUpdate(
      { email: token.email },
      {
        $set: { isVerified: true },
      },
      { new: true }
    );

    res.json("you are verified");
  } catch (error) {
    res.json(error);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ msg: "user doesnot exist" });
    if (!user.isVerified)
      return res.json({
        msg: "you are not a verified user ,please verify your email",
      });
    const token = crypto.randomBytes(24).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    res.json({ msg: "please follow the instructions send to your mail id" });
    await transporter.sendMail(forgotPasswordTemplate(token, user.email));
  } catch (error) {
    console.log(error);
  }
};

module.exports.resetPassword = async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.json({ error: "password token is expired" });
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ msg: "success your password is changed" });
  await transporter.sendMail(accountPasswordChanged(user.email));
};
