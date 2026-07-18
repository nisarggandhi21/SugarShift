const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      order_id INTEGER REFERENCES orders(id),
      duration_months INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL,
      price_per_delivery NUMERIC(10, 2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      ends_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const create = async ({
  userId,
  productId,
  orderId,
  durationMonths,
  discountPercent,
  pricePerDelivery,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO subscriptions
      (user_id, product_id, order_id, duration_months, discount_percent, price_per_delivery, ends_at)
     VALUES ($1, $2, $3, $4, $5, $6, now() + ($7 || ' months')::interval)
     RETURNING *`,
    [userId, productId, orderId, durationMonths, discountPercent, pricePerDelivery, durationMonths]
  );
  return rows[0];
};

const findByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT s.*, p.name AS product_name, p.image_url AS product_image
     FROM subscriptions s
     JOIN products p ON p.id = s.product_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { ensureTable, create, findByUser };
