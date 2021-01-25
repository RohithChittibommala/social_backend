const express = require("express");
const {
  signUp,
  logIn,
  confirmEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");
const { body, check } = require("express-validator");
const router = express.Router();

// SG.3iTd_g3oQdaJJ3R6af5oJQ.Gni5KJgcvnLISPMh9xZwfh3aA-nMFhB91dIFM_MGI9U

router.post(
  "/signup",
  body("email").isEmail(),
  check("name", "min length of name must be 3 ").isLength({ min: 3 }),
  check(
    "password",
    `Please enter a password at least 6 character 
    and contain At least one uppercase.At least 
    one lower case.At least one special character.`
  ).isLength({ min: 6 }),
  signUp
);
router.post("/login", logIn);
router.get("/conformation/:token", confirmEmail);
router.post("/forgot", forgotPassword);
router.post("/reset/", resetPassword);

module.exports = router;
