const express = require("express");
const {
  signUp,
  logIn,
  confirmEmail,
  forgotPassword,
  resetPassword,
  handlePasswordUpdate,
} = require("../controllers/authControllers");
const { body, check } = require("express-validator");
const { route } = require("./user");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello ");
});
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
router.post("/updatepassword", handlePasswordUpdate);

module.exports = router;
