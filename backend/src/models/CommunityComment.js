const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS community_comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id),
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const create = async (postId, userId, body) => {
  const { rows } = await pool.query(
    `INSERT INTO community_comments (post_id, user_id, body)
     VALUES ($1, $2, $3) RETURNING *`,
    [postId, userId, body]
  );
  return rows[0];
};

const findByPost = async (postId) => {
  const { rows } = await pool.query(
    `SELECT c.*, u.name AS author_name, u.email AS author_email
     FROM community_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return rows;
};

module.exports = { ensureTable, create, findByPost };
