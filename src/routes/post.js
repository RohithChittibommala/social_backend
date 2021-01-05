const express = require("express");
const {
  createPost,
  getAllPosts,
  handlePostLike,
  handlePostUnlike,
} = require("../controllers/postControllers");
const { verifyToken } = require("../middleware/requireLogin");
const router = express.Router();

router.post("/createpost", verifyToken, createPost);
router.get("/allposts", verifyToken, getAllPosts);
router.put("/like", verifyToken, handlePostLike);
router.put("/unlike", verifyToken, handlePostUnlike);

module.exports = router;
