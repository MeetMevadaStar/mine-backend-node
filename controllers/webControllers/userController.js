const conn = require("../../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // UUID for user ID

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  // Check if user exists and pairid is NULL
  conn.query("SELECT pair_id FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });

    if (results.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (results[0].pair_id !== null) {
      return res.status(400).json({
        msg: "User is Connected with Pair",
      });
    }

    // Now safe to delete
    conn.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });

      return res.json({ msg: "User deleted successfully" });
    });
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

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash password
    const userId = uuidv4(); // generate UUID

    conn.query(
      "INSERT INTO users (id, first_name, last_name, email, mobile, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, first_name, last_name, email, mobile, hashedPassword, role_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "DB Error", err });
        }
        return res.json({ msg: "User added successfully", userId });
      }
    );
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error });
  }
};

exports.getUsers = (req, res) => {
  conn.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });
    return res.json(results);
  });
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, mobile, role_id, password } = req.body; // role_id removed

  if (!id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    // If password is provided, hash it
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Build dynamic SQL query without role_id
    let fields = [];
    let values = [];

    if (first_name) {
      fields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name) {
      fields.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (mobile) {
      fields.push("mobile = ?");
      values.push(mobile);
    }
    if (role_id) {
      fields.push("role_id = ?");
      values.push(role_id);
    }
    if (hashedPassword) {
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ msg: "No fields provided for update" });
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    conn.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.json({ msg: "User updated successfully" });
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating user", err });
  }
};
