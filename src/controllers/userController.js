const Post = require("../models/post");
const User = require("../models/user");

module.exports.getUserDetailsAndPosts = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.id).select("-password");
    const posts = await Post.find({ postedBy: req.params.id });

    res.json({ user, posts });
  } catch (error) {
    res.json(error);
  }
};

module.exports.handleUserUnFollow = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.body.id;
    const followerUser = await User.findByIdAndUpdate(
      followerId,
      {
        $pull: { following: followingId },
      },
      { new: true }
    ).select({ password: 0 });
    const followingUser = await User.findByIdAndUpdate(
      followingId,
      {
        $pull: { followers: followerId },
      },
      { new: true }
    ).select({ password: 0 });

    res.json({ followerUser, followingUser });
  } catch (error) {}
};
module.exports.handleUserFollow = async (req, res) => {
  try {
    const followerId = req.user._id;
    const followingId = req.body.id;
    const followerUser = await User.findByIdAndUpdate(
      followerId,
      {
        $push: { following: followingId },
      },
      { new: true }
    ).select({ password: 0 });
    const followingUser = await User.findByIdAndUpdate(
      followingId,
      {
        $push: { followers: followerId },
      },
      { new: true }
    ).select({ password: 0 });
    console.log(followerUser);
    console.log(followingUser);
    res.json({ followerUser, followingUser });
  } catch (error) {}
};

module.exports.handleUserProfileUpdate = async (req, res) => {
  const id = req.user._id;
  const { url } = req.body;
  console.log(url);
  const user = await User.findByIdAndUpdate(
    id,
    {
      imageUrl: url,
    },
    {
      new: true,
    }
  );
  res.json(user);
};
