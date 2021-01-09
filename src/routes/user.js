const express = require("express");
const {
  getUserDetailsAndPosts,
  handleUserFollow,
  handleUserUnFollow,
  handleUserProfileUpdate,
} = require("../controllers/userController");
const router = express.Router();
const { verifyToken } = require("../middleware/requireLogin");

router.get("/:id", verifyToken, getUserDetailsAndPosts);
router.put("/follow", verifyToken, handleUserFollow);
router.put("/unfollow", verifyToken, handleUserUnFollow);
router.put("/update", verifyToken, handleUserProfileUpdate);

module.exports = router;
