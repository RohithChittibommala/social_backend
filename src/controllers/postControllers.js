const Post = require("../models/post");
module.exports.createPost = async (req, res) => {
  const { title, body } = req.body;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  const result = await post.save().catch((err) => console.log(err));
  res.json(result);
};
