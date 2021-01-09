const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  handlePostLike,
  handlePostUnlike,
  handleCommentOnPost,
  handleDeletePost,
} = require("../controllers/postControllers");
const { verifyToken } = require("../middleware/requireLogin");

router.post("/createpost", verifyToken, createPost);
router.get("/allposts", verifyToken, getAllPosts);
router.put("/like", verifyToken, handlePostLike);
router.put("/unlike", verifyToken, handlePostUnlike);
router.put("/comment", verifyToken, handleCommentOnPost);
router.delete("/delete/:id", verifyToken, handleDeletePost);

module.exports = router;
