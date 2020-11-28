const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "nophoto",
  },
  postedBy: {
    type: ObjectId,
    ref: "users",
  },
});

const Post = model("posts", postSchema);
module.exports = Post;
