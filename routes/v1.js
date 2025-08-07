const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes"); // ✅ Keep only one import
const authRoutes = require("./authRoutes");
const coupleRoutes = require("./coupleRoutes");

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/couple", coupleRoutes);

module.exports = router;
