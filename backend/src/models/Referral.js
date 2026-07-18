const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS referrals (
      id SERIAL PRIMARY KEY,
      referrer_id INTEGER NOT NULL REFERENCES users(id),
      referred_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      bonus_points INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const create = async (referrerId, referredId, bonusPoints) => {
  const { rows } = await pool.query(
    `INSERT INTO referrals (referrer_id, referred_id, bonus_points)
     VALUES ($1, $2, $3) RETURNING *`,
    [referrerId, referredId, bonusPoints]
  );
  return rows[0];
};

const findByReferrer = async (referrerId) => {
  const { rows } = await pool.query(
    `SELECT r.*, u.name AS referred_name, u.email AS referred_email
     FROM referrals r
     JOIN users u ON u.id = r.referred_id
     WHERE r.referrer_id = $1
     ORDER BY r.created_at DESC`,
    [referrerId]
  );
  return rows;
};

module.exports = { ensureTable, create, findByReferrer };
