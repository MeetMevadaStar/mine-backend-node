const conn = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.createPair = (req, res) => {
  const { user1_id, user2_id } = req.body;

  // Step 1: Validate input
  if (!user1_id || !user2_id) {
    return res
      .status(400)
      .json({ msg: "Both user1_id and user2_id are required" });
  }

  // Step 2: Check if both users exist
  const checkQuery = `
    SELECT id, pair_id FROM users WHERE id IN (?, ?)
  `;

  conn.query(checkQuery, [user1_id, user2_id], (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });

    // Validate each user separately
    const foundIds = results.map((u) => u.id);

    if (!foundIds.includes(user1_id)) {
      return res
        .status(404)
        .json({ msg: `User with id ${user1_id} not found` });
    }

    if (!foundIds.includes(user2_id)) {
      return res
        .status(404)
        .json({ msg: `User with id ${user2_id} not found` });
    }

    const alreadyPaired = results.some((user) => user.pair_id !== null);

    if (alreadyPaired) {
      return res
        .status(400)
        .json({ msg: "One or both users are already in a pair" });
    }

    // Step 3: Generate UUID for pair
    const pairId = uuidv4();

    // Step 4: Insert into couples table
    conn.query(
      "INSERT INTO couples (id, user1_id, user2_id) VALUES (?, ?, ?)",
      [pairId, user1_id, user2_id],
      (err2) => {
        if (err2) return res.status(500).json({ msg: "DB Error", err: err2 });

        // Step 5: Update users' pair_id
        conn.query(
          "UPDATE users SET pair_id = ? WHERE id IN (?, ?)",
          [pairId, user1_id, user2_id],
          (err3) => {
            if (err3)
              return res
                .status(500)
                .json({ msg: "DB Error on user update", err: err3 });

            return res.json({ msg: "Pair created successfully", pairId });
          }
        );
      }
    );
  });
};

exports.getAllPairs = (req, res) => {
  const sql = `
    SELECT 
      c.id AS pair_id,
      CONCAT(u1.first_name, ' ', u1.last_name) AS user1_name,
      CONCAT(u2.first_name, ' ', u2.last_name) AS user2_name,
      c.created_at AS pair_created_time
    FROM couples c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    ORDER BY c.created_at DESC;
  `;

  conn.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });
    return res.json(results);
  });
};

exports.deletePair = (req, res) => {
  const { pairId } = req.params;

  if (!pairId) {
    return res.status(400).json({ msg: "pairId is required" });
  }

  // Step 1: Fetch the pair to get user IDs
  const fetchUsersQuery = `SELECT user1_id, user2_id FROM couples WHERE id = ?`;

  conn.query(fetchUsersQuery, [pairId], (err, results) => {
    if (err) return res.status(500).json({ msg: "DB Error", err });

    if (results.length === 0) {
      return res.status(404).json({ msg: "Pair not found" });
    }

    const { user1_id, user2_id } = results[0];

    // Step 2: Delete the pair
    const deletePairQuery = `DELETE FROM couples WHERE id = ?`;

    conn.query(deletePairQuery, [pairId], (err2) => {
      if (err2)
        return res.status(500).json({ msg: "DB Error on delete", err: err2 });

      // Step 3: Remove pair_id from both users
      const updateUsersQuery = `UPDATE users SET pair_id = NULL WHERE id IN (?, ?)`;

      conn.query(updateUsersQuery, [user1_id, user2_id], (err3) => {
        if (err3)
          return res
            .status(500)
            .json({ msg: "DB Error updating users", err: err3 });

        return res.json({
          msg: "Pair deleted and users unpaired successfully",
        });
      });
    });
  });
};
