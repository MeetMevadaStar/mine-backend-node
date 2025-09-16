const jwt = require("jsonwebtoken");

exports.adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD ||
      !process.env.JWT_SECRET
    ) {
      console.error("❌ Missing environment variables");
      return res.status(500).json({ msg: "Server misconfigured" });
    }

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ token });
    }

    return res.status(401).json({ msg: "Invalid credentials" });
  } catch (err) {
    console.error("❌ Admin login failed:", err.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
