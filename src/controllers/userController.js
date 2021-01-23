const Post = require("../models/post");
const User = require("../models/user");

module.exports.getUserDetailsAndPosts = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name _id imageUrl")
      .populate("following", "name _id imageUrl");

    const posts = await Post.find({ postedBy: req.params.id });

    res.json({ user, posts });
  } catch (error) {
    res.json(error);
  }
};

module.exports.handleUserUnFollow = async (req, res) => {
  try {
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
  } catch (error) {
    res.json({ error });
  }
};
module.exports.handleUserFollow = async (req, res) => {
  try {
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
  } catch (error) {
    res.error({ error });
  }
};

module.exports.handleUserProfileUpdate = async (req, res) => {
  try {
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
  } catch (error) {
    res.json({ error });
  }
};
