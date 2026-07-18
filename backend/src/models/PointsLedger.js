const { pool } = require("../config/db");
const { EXPIRY_MONTHS } = require("../utils/loyalty");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS points_transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      type TEXT NOT NULL CHECK (type IN ('earn', 'redeem')),
      points INTEGER NOT NULL,
      order_id INTEGER REFERENCES orders(id),
      reward_id TEXT,
      reward_name TEXT,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const earn = async (userId, orderId, points) => {
  const { rows } = await pool.query(
    `INSERT INTO points_transactions (user_id, type, points, order_id, expires_at)
     VALUES ($1, 'earn', $2, $3, now() + $4::interval)
     RETURNING *`,
    [userId, points, orderId, `${EXPIRY_MONTHS} months`]
  );
  return rows[0];
};

const redeem = async (userId, rewardId, rewardName, points) => {
  const { rows } = await pool.query(
    `INSERT INTO points_transactions (user_id, type, points, reward_id, reward_name)
     VALUES ($1, 'redeem', $2, $3, $4)
     RETURNING *`,
    [userId, points, rewardId, rewardName]
  );
  return rows[0];
};

const getBalance = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(SUM(points) FILTER (WHERE type = 'earn' AND expires_at > now()), 0)
         - COALESCE(SUM(points) FILTER (WHERE type = 'redeem'), 0) AS balance
     FROM points_transactions
     WHERE user_id = $1`,
    [userId]
  );
  return parseInt(rows[0].balance, 10);
};

const getNextExpiry = async (userId) => {
  const { rows } = await pool.query(
    `SELECT points, expires_at FROM points_transactions
     WHERE user_id = $1 AND type = 'earn' AND expires_at > now()
     ORDER BY expires_at ASC
     LIMIT 1`,
    [userId]
  );
  if (!rows[0]) return null;
  return { points: rows[0].points, date: rows[0].expires_at };
};

const getRedemptions = async (userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM points_transactions
     WHERE user_id = $1 AND type = 'redeem'
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { ensureTable, earn, redeem, getBalance, getNextExpiry, getRedemptions };
