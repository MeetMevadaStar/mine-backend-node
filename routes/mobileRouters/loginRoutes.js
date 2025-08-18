const express = require("express");
const router = express.Router();
const {
  loginUser,
} = require("../../controllers/mobileControllers/mobileLoginController");

router.post("/user-login", loginUser);

module.exports = router;
