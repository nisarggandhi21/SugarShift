const { pool } = require("../config/db");
const { tierForPoints } = require("../utils/loyalty");

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      google_id TEXT UNIQUE,
      name TEXT,
      avatar_url TEXT,
      points INTEGER NOT NULL DEFAULT 0,
      tier TEXT NOT NULL DEFAULT 'Bronze',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0`
  );
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'Bronze'`
  );
};

const findById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

const findByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const findByGoogleId = async (googleId) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE google_id = $1",
    [googleId]
  );
  return rows[0];
};

const createLocal = async (email, passwordHash, name) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3) RETURNING *`,
    [email, passwordHash, name]
  );
  return rows[0];
};

const createGoogle = async (email, googleId, name, avatarUrl) => {
  const { rows } = await pool.query(
    `INSERT INTO users (email, google_id, name, avatar_url)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, googleId, name, avatarUrl]
  );
  return rows[0];
};

const linkGoogleId = async (id, googleId, avatarUrl) => {
  const { rows } = await pool.query(
    `UPDATE users SET google_id = $2, avatar_url = COALESCE(avatar_url, $3)
     WHERE id = $1 RETURNING *`,
    [id, googleId, avatarUrl]
  );
  return rows[0];
};

const addPoints = async (id, points) => {
  const user = await findById(id);
  const newPoints = user.points + points;
  const newTier = tierForPoints(newPoints);

  const { rows } = await pool.query(
    `UPDATE users SET points = $2, tier = $3 WHERE id = $1 RETURNING *`,
    [id, newPoints, newTier]
  );
  return rows[0];
};

module.exports = {
  ensureTable,
  findById,
  findByEmail,
  findByGoogleId,
  createLocal,
  createGoogle,
  linkGoogleId,
  addPoints,
};
