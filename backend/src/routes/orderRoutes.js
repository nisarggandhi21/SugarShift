const express = require("express");
const { create, listMine } = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", create);
router.get("/me", listMine);

module.exports = router;
