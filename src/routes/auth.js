const express = require("express");
const { signUp, logIn, protected } = require("../controllers/authControllers");
const router = express.Router();
router.post("/signup", signUp);
router.post("/login", logIn);

module.exports = router;
