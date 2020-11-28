const express = require("express");
const { createPost } = require("../controllers/postControllers");
const { verifyToken } = require("../middleware/requireLogin");
const router = express.Router();

router.post("/createpost", verifyToken, createPost);

module.exports = router;
