const Post = require("../models/post");
const { Types } = require("mongoose");
const { ObjectId } = Types;
module.exports.createPost = async (req, res) => {
  const { title, description, url } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "title and description can't be empty" });
  }
  const post = new Post({
    title,
    description,
    postedBy: req.user._id,
    url,
  });
  console.log(post);
  const result = await post.save().catch((err) => console.log(err));
  res.json(result);
};
module.exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id name imageUrl")
    .catch((err) => console.log(err));
  const myPosts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name imageUrl"
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
    console.log(comment);
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
module.exports.handleDeletePost = async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {}
};
