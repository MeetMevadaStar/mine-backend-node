const jwt = require("jsonwebtoken");
const conn = require("../config/db");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: "Invalid token" });
    }

    // decoded = { id, role, iat }
    req.user = decoded;

    // ✅ If role is male or female, check pair_id in DB
    if (decoded.role === "male" || decoded.role === "female") {
      conn.query(
        "SELECT pair_id FROM users WHERE id = ?",
        [decoded.id],
        (dbErr, results) => {
          if (dbErr)
            return res.status(500).json({ msg: "DB Error", err: dbErr });

          if (results.length === 0) {
            return res.status(404).json({ msg: "User not found" });
          }

          const { pair_id } = results[0];

          if (!pair_id) {
            return res
              .status(401)
              .json({ msg: "User must be in a pair to access this resource" });
          }

          next(); // ✅ allowed
        }
      );
    } else {
      next(); // ✅ other roles bypass pair_id check
    }
  });
};

// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(401).json({ msg: "No token provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ msg: "Invalid token" });
//     }

//     req.user = decoded; // decoded contains { id, role, iat }
//     next();
//   });
// };
