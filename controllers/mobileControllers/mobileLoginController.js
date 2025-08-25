const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conn = require("../../config/db");

exports.loginUser = (req, res) => {
  const { email, password, firebaseToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and Password are required" });
  }

  conn.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ msg: "DB Error", err });

      if (results.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const user = results[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid credentials" });
      }

      // 🚨 Throw error if user not in pair
      if (!user.pair_id) {
        return res.status(403).json({
          msg: "User is not in a pair. Please complete pairing first.",
        });
      }

      // ✅ Update Firebase token in DB
      if (firebaseToken) {
        conn.query(
          "UPDATE users SET firebase_token = ? WHERE id = ?",
          [firebaseToken, user.id],
          (updateErr) => {
            if (updateErr) {
              console.error("Firebase token update error:", updateErr);
            }
          }
        );
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Remove password before sending response
      const { password: _, ...userData } = user;

      return res.json({
        msg: "Login successful",
        token,
        user: {
          ...userData,
          firebase_token: firebaseToken || user.firebase_token,
        },
      });
    }
  );
};
