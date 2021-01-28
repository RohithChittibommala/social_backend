const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
module.exports.verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.json({ error: "you must be logged in" });
  const token = authorization.replace("Bearer:", "");
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, payload) => {
    if (error) return res.json(error);
    const token = payload._id;
    const user = await User.findById(token)
      .populate("followers", "name _id imageUrl")
      .populate("following", "name _id imageUrl")
      .select({ password: 0, __v: 0 });
    req.user = user;
    next();
  });
};
