const express = require("express");
const { list, getOne, listCategories } = require("../controllers/productController");

const router = express.Router();

router.get("/", list);
router.get("/categories", listCategories);
router.get("/:id", getOne);

module.exports = router;
