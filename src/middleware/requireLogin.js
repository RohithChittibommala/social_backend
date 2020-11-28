const jwt = require("jsonwebtoken");
const { Jwt_Secret } = require("../../variables.js");
const User = require("../models/user.js");

module.exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.send("you must be logged   in");
  const token = authorization.replace("Bearer:", "");
  const isValidUser = jwt.verify(token, Jwt_Secret, async (error, payload) => {
    const token = payload._id;
    const user = await User.findById(token).select({ password: 0, __v: 0 });
    req.user = user;
    next();
  });
};
