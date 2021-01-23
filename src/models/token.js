const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Token = mongoose.model("tokens", tokenSchema);
module.exports = Token;
