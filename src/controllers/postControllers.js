const Post = require("../models/post");
const { Types } = require("mongoose");
const { ObjectId } = Types;
module.exports.createPost = async (req, res) => {
  const { title, description, url } = req.body;

  if (!title || !description || !url) {
    return res.status(400).json({ error: "all fields  can't be empty" });
  }
  const post = new Post({
    title,
    description,
    url,
    postedBy: req.user,
  });
  const result = await post.save().catch((err) => console.log(err));
  res.json(result);
};
module.exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id name")
    .catch((err) => console.log(err));
  const myPosts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );
  res.json({ myPosts, posts });
};
module.exports.handlePostLike = async (req, res) => {
  try {
    Post.findByIdAndUpdate(
      new ObjectId(req.body.postID),
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      console.log(err);
      res.json(result);
    });
  } catch (error) {}
};
module.exports.handlePostUnlike = async (req, res) => {
  try {
    Post.findByIdAndUpdate(
      new ObjectId(req.body.postID),
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      console.log(err);
      res.json(result);
    });
  } catch (error) {}
};
module.exports.handleCommentOnPost = async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    Post.findByIdAndUpdate(
      new ObjectId(req.body.postID),
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .exec((err, result) => {
        if (err) return res.status(422).json({ error: err });
        console.log(err);
        res.json(result);
      });
  } catch (error) {}
};
