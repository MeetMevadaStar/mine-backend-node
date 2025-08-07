const conn = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // UUID for user ID

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  conn.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({ msg: "User deleted successfully" });
  });
};

exports.addUser = async (req, res) => {
  const { first_name, last_name, email, mobile, password, role_id } = req.body;

  // Validate role_id
  const allowedRoles = ["admin", "male", "female"];
  if (!allowedRoles.includes(role_id)) {
    return res
      .status(400)
      .json({ msg: "Invalid role_id. Use admin, male, or female." });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // hash provided password
  const userId = uuidv4(); // generate UUID

  conn.query(
    "INSERT INTO users (id, first_name, last_name, email, mobile, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, first_name, last_name, email, mobile, hashedPassword, role_id],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });
      return res.json({ msg: "User added successfully", userId });
    }
  );
};

exports.getUsers = (req, res) => {
  conn.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });
    return res.json(results);
  });
};
