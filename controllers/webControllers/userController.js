const conn = require("../../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // UUID for user ID

// ---------------- Delete User ----------------
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  // Check if user exists and pair_id is NULL
  conn.query(
    "SELECT pair_id FROM users WHERE id = $1",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });

      if (results.rows.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (results.rows[0].pair_id !== null) {
        return res.status(400).json({
          msg: "User is Connected with Pair",
        });
      }

      // Now safe to delete
      conn.query("DELETE FROM users WHERE id = $1", [id], (err, result) => {
        if (err) return res.status(500).json({ msg: "DB Error", err });

        return res.json({ msg: "User deleted successfully" });
      });
    }
  );
};

// ---------------- Add User ----------------
exports.addUser = async (req, res) => {
  const { first_name, last_name, email, mobile, password, role_id } = req.body;

  const allowedRoles = ["admin", "male", "female"];
  if (!allowedRoles.includes(role_id)) {
    return res
      .status(400)
      .json({ msg: "Invalid role_id. Use admin, male, or female." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    conn.query(
      "INSERT INTO users (id, first_name, last_name, email, mobile, password, role_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [userId, first_name, last_name, email, mobile, hashedPassword, role_id],
      (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).json({ msg: "DB Error", err });
        }
        return res.json({ msg: "User added successfully", userId });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error", error });
  }
};

// ---------------- Get Users ----------------
exports.getUsers = (req, res) => {
  conn.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });
    return res.json(results.rows); // ✅ .rows in PostgreSQL
  });
};

// ---------------- Edit User ----------------
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, mobile, role_id, password } = req.body;

  if (!id) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let fields = [];
    let values = [];
    let idx = 1;

    if (first_name) {
      fields.push(`first_name = $${idx++}`);
      values.push(first_name);
    }
    if (last_name) {
      fields.push(`last_name = $${idx++}`);
      values.push(last_name);
    }
    if (email) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (mobile) {
      fields.push(`mobile = $${idx++}`);
      values.push(mobile);
    }
    if (role_id) {
      fields.push(`role_id = $${idx++}`);
      values.push(role_id);
    }
    if (hashedPassword) {
      fields.push(`password = $${idx++}`);
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ msg: "No fields provided for update" });
    }

    values.push(id); // last param
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx}`;

    conn.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });

      if (result.rowCount === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.json({ msg: "User updated successfully" });
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating user", err });
  }
};
