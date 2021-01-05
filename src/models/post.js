const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: "",
  },
  likes: [{ type: ObjectId, ref: "users" }],
  comments: [{ text: String, postedBy: { type: ObjectId, ref: "users" } }],
  postedBy: {
    type: ObjectId,
    ref: "users",
  },
});

const Post = model("posts", postSchema);
module.exports = Post;
