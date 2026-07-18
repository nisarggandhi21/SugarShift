const express = require("express");
const {
  listCategories,
  listPosts,
  createPost,
  toggleLike,
  listComments,
  createComment,
} = require("../controllers/communityController");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/categories", listCategories);
router.get("/posts", optionalAuth, listPosts);
router.post("/posts", requireAuth, createPost);
router.post("/posts/:id/like", requireAuth, toggleLike);
router.get("/posts/:id/comments", listComments);
router.post("/posts/:id/comments", requireAuth, createComment);

module.exports = router;
