const Post = require("../models/post");
const User = require("../models/user");
const asyncMiddleware = require("../middleware/async");

module.exports.getUserDetailsAndPosts = asyncMiddleware(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");
  const posts = await Post.find({ postedBy: req.params.id });
  res.json({ user, posts });
});

module.exports.handleUserUnFollow = asyncMiddleware(async (req, res) => {
  const currentUserId = req.user._id;
  const userToBeUnFollowedId = req.body.id;
  const currentUser = await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToBeUnFollowedId },
    },
    { new: true }
  )
    .select({ password: 0 })
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");
  const unfollowedUser = await User.findByIdAndUpdate(
    userToBeUnFollowedId,
    {
      $pull: { followers: currentUserId },
    },
    { new: true }
  )
    .select({ password: 0 })
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");

  res.json({ currentUser, unfollowedUser });
});

module.exports.handleUserFollow = asyncMiddleware(async (req, res) => {
  const currentUserId = req.user._id;
  const userToBeFollowedId = req.body.id;
  const currentUser = await User.findByIdAndUpdate(
    currentUserId,
    {
      $push: { following: userToBeFollowedId },
    },
    { new: true }
  )
    .select({ password: 0 })
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");
  const followedUser = await User.findByIdAndUpdate(
    userToBeFollowedId,
    {
      $push: { followers: currentUserId },
    },
    { new: true }
  )
    .select({ password: 0 })
    .populate("followers", "name _id imageUrl")
    .populate("following", "name _id imageUrl");
  res.json({ currentUser, followedUser });
});

module.exports.handleUserProfileUpdate = asyncMiddleware(async (req, res) => {
  const id = req.user._id;
  const { url } = req.body;
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
});
