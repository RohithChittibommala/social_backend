const Post = require("../models/post");
const { Types } = require("mongoose");
const { ObjectId } = Types;
const asyncMiddleware = require("../middleware/async");
module.exports.createPost = asyncMiddleware(async (req, res) => {
  if (!req.body.title && !req.body.description) {
    return res
      .status(400)
      .json({ error: "title and description can't be empty" });
  }
  const { title, description, url } = req.body;
  const post = new Post({
    title,
    description,
    postedBy: req.user._id,
    url,
  });
  const result = await post
    .save()
    .then((p) => p.populate("postedBy", "_id name imageUrl").execPopulate());
  res.json(result);
});
module.exports.getAllPosts = asyncMiddleware(async (req, res) => {
  const posts = await Post.find()
    .limit(5)
    .sort("createdAt")
    .populate("postedBy", "_id name imageUrl")
    .populate("comments.postedBy", "_id name");
  const myPosts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name imageUrl"
  );
  const noOfPosts = await Post.estimatedDocumentCount();
  res.json({ myPosts, posts, user: req.user, totalNoOfPosts: noOfPosts });
});

module.exports.getMorePosts = asyncMiddleware(async (req, res) => {
  const { count } = req.params;
  const posts = await Post.find()
    .skip(count * 5)
    .limit(5)
    .sort("createdAt")
    .populate("postedBy", "_id name imageUrl")
    .populate("comments.postedBy", "_id name");
  res.json(posts);
});

module.exports.handlePostLike = asyncMiddleware(async (req, res) => {
  Post.findByIdAndUpdate(
    new ObjectId(req.body.postID),
    {
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name imageUrl")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      res.json(result);
    });
});
module.exports.handlePostUnlike = asyncMiddleware(async (req, res) => {
  Post.findByIdAndUpdate(
    new ObjectId(req.body.postID),
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .populate("postedBy", "_id name imageUrl")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      res.json(result);
    });
});
module.exports.handleCommentOnPost = asyncMiddleware(async (req, res) => {
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
    .populate("postedBy", "_id name imageUrl")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      res.json(result);
    });
});
module.exports.handleDeletePost = asyncMiddleware(async (req, res) => {
  const result = await Post.findByIdAndDelete(req.params.id);
  res.json(result);
});
