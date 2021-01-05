const express = require("express");
const { signUp, logIn, protected } = require("../controllers/authControllers");
const { body, check } = require("express-validator");
const router = express.Router();
router.post(
  "/signup",
  body("email").isEmail(),
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long"),
  check(
    "password",
    "Please enter a password at least 6 character and contain At least one uppercase.At least one lower case.At least one special character. "
  )
    .isLength({ min: 6 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
  signUp
);
router.post("/login", logIn);

module.exports = router;
