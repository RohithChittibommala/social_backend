const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const asyncMiddleware = require("../middleware/async");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Token = require("../models/token");
const {
  verifyEmailTemplate,
  forgotPasswordTemplate,
  accountPasswordChanged,
} = require("../utils/emialTemplates");
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: { api_key: process.env.SENDGRID_API_KEY },
  })
);

module.exports.signUp = asyncMiddleware(async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
});

module.exports.logIn = asyncMiddleware(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");
  if (!user)
    return res.status(400).json({ userExist: "no such user with mail exists" });
  const doesPasswordMatch = await user.comparePasswords(password);
  if (!doesPasswordMatch)
    return res.status(400).json({ password: "invalid password" });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
  user.password = null;
  res.json({ token, user });
});

module.exports.confirmEmail = asyncMiddleware(async (req, res) => {
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
});

module.exports.forgotPassword = asyncMiddleware(async (req, res) => {
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
});

module.exports.resetPassword = asyncMiddleware(async (req, res) => {
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
});

module.exports.handlePasswordUpdate = asyncMiddleware(async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;
  const user = await User.findOne({ email });
  const doesPasswordMatch = await user.comparePasswords(oldPassword);
  if (!doesPasswordMatch)
    return res.json({ error: "sorry password doesn't match" });
  user.password = newPassword;
  await user.save();
  res.json({ msg: "password updated" });
  await transporter.sendMail(accountPasswordChanged(user.email));
});
