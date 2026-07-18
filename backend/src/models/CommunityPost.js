const { pool } = require("../config/db");

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS community_post_likes (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (post_id, user_id)
    )
  `);
};

const create = async (userId, category, title, body) => {
  const { rows } = await pool.query(
    `INSERT INTO community_posts (user_id, category, title, body)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, category, title, body]
  );
  return rows[0];
};

const findAll = async (category, viewerId) => {
  const params = viewerId ? [viewerId] : [null];
  let where = "";
  if (category) {
    params.push(category);
    where = `WHERE p.category = $${params.length}`;
  }

  const { rows } = await pool.query(
    `SELECT
       p.*,
       u.name AS author_name,
       u.email AS author_email,
       COUNT(DISTINCT l.id)::int AS like_count,
       COUNT(DISTINCT c.id)::int AS comment_count,
       BOOL_OR(l.user_id = $1) AS liked_by_viewer
     FROM community_posts p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN community_post_likes l ON l.post_id = p.id
     LEFT JOIN community_comments c ON c.post_id = p.id
     ${where}
     GROUP BY p.id, u.name, u.email
     ORDER BY p.created_at DESC`,
    params
  );
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM community_posts WHERE id = $1", [id]);
  return rows[0];
};

const toggleLike = async (postId, userId) => {
  const { rows } = await pool.query(
    "SELECT id FROM community_post_likes WHERE post_id = $1 AND user_id = $2",
    [postId, userId]
  );

  if (rows[0]) {
    await pool.query("DELETE FROM community_post_likes WHERE id = $1", [rows[0].id]);
    return false;
  }

  await pool.query(
    "INSERT INTO community_post_likes (post_id, user_id) VALUES ($1, $2)",
    [postId, userId]
  );
  return true;
};

const getLikeCount = async (postId) => {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM community_post_likes WHERE post_id = $1",
    [postId]
  );
  return rows[0].count;
};

module.exports = { ensureTable, create, findAll, findById, toggleLike, getLikeCount };
