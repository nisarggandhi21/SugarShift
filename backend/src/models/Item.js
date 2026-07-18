const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const findAll = async () => {
  const { rows } = await pool.query("SELECT * FROM items ORDER BY id");
  return rows;
};

const create = async (name) => {
  const { rows } = await pool.query(
    "INSERT INTO items (name) VALUES ($1) RETURNING *",
    [name]
  );
  return rows[0];
};

module.exports = { ensureTable, findAll, create };
