const conn = require("../../config/db");

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.mobile,
      u.role_id,
      c.id AS pair_id,
      c.created_at AS pair_created_time,
      partner.id AS partner_id,
      CONCAT(partner.first_name, ' ', partner.last_name) AS partner_name,
      partner.email AS partner_email,
      partner.mobile AS partner_mobile
    FROM users u
    LEFT JOIN couples c 
      ON u.pair_id = c.id
    LEFT JOIN users partner 
      ON ( (c.user1_id = u.id AND c.user2_id = partner.id) 
         OR (c.user2_id = u.id AND c.user1_id = partner.id) )
    WHERE u.id = ?;
  `;

  conn.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });

    if (results.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json(results[0]);
  });
};
