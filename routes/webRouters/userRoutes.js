const express = require("express");
const router = express.Router();
const {
  addUser,
  getUsers,
  deleteUser,
  editUser,
} = require("../../controllers/webControllers/userController");
const auth = require("../../middlewares/authMiddleware");

// Add a new user
router.post("/add-user", auth, addUser);

// Get all users
router.get("/all-users", auth, getUsers);

// Delete a user by ID
router.delete("/delete-user/:id", auth, deleteUser);

// Edit a user by ID
router.put("/edit-user/:id", auth, editUser);

module.exports = router;
