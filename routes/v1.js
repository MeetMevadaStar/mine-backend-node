const express = require("express");
const router = express.Router();

// Web Imports
const userRoutes = require("./webRouters/userRoutes");
const authRoutes = require("./webRouters/authRoutes");
const coupleRoutes = require("./webRouters/coupleRoutes");

// Mobile Imports
const loginRoutes = require("./mobileRouters/loginRoutes");
const userProfileRoutes = require("./mobileRouters/profileRoutes");

// Web routes
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/couple", coupleRoutes);

// Mobile routes
router.use("/mobile-login", loginRoutes);
router.use("/mobile-User", userProfileRoutes);

module.exports = router;
