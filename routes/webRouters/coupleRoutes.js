const express = require("express");
const router = express.Router();
const {
  createPair,
  getAllPairs,
  deletePair,
} = require("../../controllers/webControllers/coupleController");
const auth = require("../../middlewares/authMiddleware");

router.post("/create-pair", auth, createPair);
router.get("/get-pairs", auth, getAllPairs);
router.delete("/delete-pair/:pairId", auth, deletePair);

module.exports = router;
