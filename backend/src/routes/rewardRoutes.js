const express = require("express");
const { list, redeem, listRedemptions } = require("../controllers/rewardController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", list);
router.get("/redemptions", requireAuth, listRedemptions);
router.post("/:id/redeem", requireAuth, redeem);

module.exports = router;
