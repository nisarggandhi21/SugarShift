const express = require("express");
const { create, checkout, listMine } = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.post("/", create);
router.post("/checkout", checkout);
router.get("/me", listMine);

module.exports = router;
