const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      amount NUMERIC(10, 2) NOT NULL,
      points_earned INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const create = async (userId, productId, quantity, amount, pointsEarned) => {
  const { rows } = await pool.query(
    `INSERT INTO orders (user_id, product_id, quantity, amount, points_earned)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, productId, quantity, amount, pointsEarned]
  );
  return rows[0];
};

const findByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT o.*, p.name AS product_name, p.image_url AS product_image
     FROM orders o
     JOIN products p ON p.id = o.product_id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { ensureTable, create, findByUser };
