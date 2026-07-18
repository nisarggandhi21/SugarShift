const express = require("express");
const { getMine } = require("../controllers/referralController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, getMine);

module.exports = router;
