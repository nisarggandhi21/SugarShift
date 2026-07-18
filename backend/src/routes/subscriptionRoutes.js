const express = require("express");
const { create, listMine } = require("../controllers/subscriptionController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", create);
router.get("/me", listMine);

module.exports = router;
