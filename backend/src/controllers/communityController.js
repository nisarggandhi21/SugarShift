const CommunityPost = require("../models/CommunityPost");
const CommunityComment = require("../models/CommunityComment");
const { COMMUNITY_CATEGORIES } = require("../utils/communityCategories");

const authorName = (row) => row.author_name || row.author_email;

const toPublicPost = (p) => ({
  id: p.id,
  category: p.category,
  title: p.title,
  body: p.body,
  author: authorName(p),
  likeCount: p.like_count,
  commentCount: p.comment_count,
  likedByViewer: p.liked_by_viewer,
  createdAt: p.created_at,
});

const listCategories = (req, res) => {
  res.json(COMMUNITY_CATEGORIES);
};

const listPosts = async (req, res) => {
  const posts = await CommunityPost.findAll(req.query.category, req.user?.id);
  res.json(posts.map(toPublicPost));
};

const createPost = async (req, res) => {
  const { category, title, body } = req.body;

  if (!COMMUNITY_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Choose a valid category" });
  }
  if (!title?.trim() || !body?.trim()) {
    return res.status(400).json({ error: "Title and post body are required" });
  }

  const post = await CommunityPost.create(req.user.id, category, title.trim(), body.trim());
  res.status(201).json(
    toPublicPost({
      ...post,
      author_name: req.user.name,
      author_email: req.user.email,
      like_count: 0,
      comment_count: 0,
      liked_by_viewer: false,
    })
  );
};

const toggleLike = async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const liked = await CommunityPost.toggleLike(post.id, req.user.id);
  const likeCount = await CommunityPost.getLikeCount(post.id);
  res.json({ liked, likeCount });
};

const listComments = async (req, res) => {
  const comments = await CommunityComment.findByPost(req.params.id);
  res.json(
    comments.map((c) => ({
      id: c.id,
      body: c.body,
      author: authorName(c),
      createdAt: c.created_at,
    }))
  );
};

const createComment = async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: "Comment can't be empty" });

  const post = await CommunityPost.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const comment = await CommunityComment.create(post.id, req.user.id, body.trim());
  res.status(201).json({
    id: comment.id,
    body: comment.body,
    author: req.user.name || req.user.email,
    createdAt: comment.created_at,
  });
};

module.exports = { listCategories, listPosts, createPost, toggleLike, listComments, createComment };
