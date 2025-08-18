const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");
const {
  getProfile,
} = require("../../controllers/mobileControllers/userProfileController");

// protected
router.get("/profile", auth, getProfile);

module.exports = router;
