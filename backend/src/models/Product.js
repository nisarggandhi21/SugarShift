const { pool } = require("../config/db");
const seedProducts = require("../seed/products.json");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      product_type TEXT,
      price NUMERIC(10, 2) NOT NULL,
      compare_at_price NUMERIC(10, 2),
      image_url TEXT NOT NULL,
      description TEXT,
      source_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const seedIfEmpty = async () => {
  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM products");
  if (rows[0].count > 0) return;

  for (const p of seedProducts) {
    await pool.query(
      `INSERT INTO products
        (name, brand, category, product_type, price, compare_at_price, image_url, description, source_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        p.name,
        p.brand,
        p.category,
        p.product_type,
        p.price,
        p.compare_at_price,
        p.image_url,
        p.description,
        p.source_url,
      ]
    );
  }
};

const findAll = async (category) => {
  if (category) {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE category = $1 ORDER BY id",
      [category]
    );
    return rows;
  }
  const { rows } = await pool.query("SELECT * FROM products ORDER BY id");
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return rows[0];
};

const categories = async () => {
  const { rows } = await pool.query(
    "SELECT category, COUNT(*)::int AS count FROM products GROUP BY category ORDER BY category"
  );
  return rows;
};

module.exports = { ensureTable, seedIfEmpty, findAll, findById, categories };
