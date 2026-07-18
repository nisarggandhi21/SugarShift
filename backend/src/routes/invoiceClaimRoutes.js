const express = require("express");
const multer = require("multer");
const { create, listMine, getFile } = require("../controllers/invoiceClaimController");
const { requireAuth } = require("../middleware/auth");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP, or PDF files are allowed"));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.use(requireAuth);
router.post("/", (req, res, next) => {
  upload.single("invoice")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, create);
router.get("/me", listMine);
router.get("/:id/file", getFile);

module.exports = router;
