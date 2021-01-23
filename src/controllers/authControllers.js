const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { Jwt_Secret, api_key } = require("../../variables.js");
const { validationResult } = require("express-validator");
const Token = require("../models/token");

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
    const userToken = crypto.randomBytes(124).toString("hex");
    const token = new Token({ email, token: userToken });
    await token.save();
    await transporter.sendMail({
      to: email,
      from: "company.social.network.org@gmail.com",
      subject: "Verify your email",
      html: ` <p>Click on the following link to verfy ur accout</p>
      <a href=http://localhost:4000/conformation/${userToken}>click here</a>`,
    });
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

    res.json(user);
  } catch (error) {
    res.json(error);
  }
};
module.exports.forgotPassword = (req, res) => {
  User.find({ email: req.body.email }, (err, doc) => {
    if (!doc) return res.json({ msg: "user does exist" });
    console.log(doc);
  });
  res.json({ msg: "user  exist" });
};

const sendMailToUser = async (email, token) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
