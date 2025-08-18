const express = require("express");
const router = express.Router();

// Web Imports
const userRoutes = require("./webRouters/userRoutes");
const authRoutes = require("./webRouters/authRoutes");
const coupleRoutes = require("./webRouters/coupleRoutes");

// Mobile Imports
const loginRoutes = require("./mobileRouters/loginRoutes");
const userProfileRoutes = require("./mobileRouters/profileRoutes");

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/couple", coupleRoutes);

router.use("/mobile-login", loginRoutes);
router.use("/mobile-User", userProfileRoutes);

module.exports = router;
