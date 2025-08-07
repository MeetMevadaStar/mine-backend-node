const jwt = require("jsonwebtoken");

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  if (username === "meetstarboy" && password === "Admin@123") {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token });
  }
  return res.status(401).json({ msg: "Invalid credentials" });
};
