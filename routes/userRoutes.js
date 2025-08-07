const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// Add a new user
router.post("/add-user", auth, addUser);

// Get all users
router.get("/all-users", auth, getUsers);

// Delete a user by ID
router.delete("/delete-user/:id", auth, deleteUser);

module.exports = router;
