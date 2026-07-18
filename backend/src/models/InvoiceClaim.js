const { pool } = require("../config/db");

const ensureTable = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS invoice_claims (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      retailer TEXT NOT NULL,
      invoice_number TEXT,
      amount NUMERIC(10, 2) NOT NULL,
      points_claimed INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

const create = async ({
  userId,
  retailer,
  invoiceNumber,
  amount,
  pointsClaimed,
  fileName,
  fileType,
  fileData,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO invoice_claims
      (user_id, retailer, invoice_number, amount, points_claimed, file_name, file_type, file_data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, user_id, retailer, invoice_number, amount, points_claimed, status, file_name, file_type, created_at`,
    [userId, retailer, invoiceNumber, amount, pointsClaimed, fileName, fileType, fileData]
  );
  return rows[0];
};

const findByUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT id, user_id, retailer, invoice_number, amount, points_claimed, status, file_name, file_type, created_at
     FROM invoice_claims
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

const findFileById = async (id, userId) => {
  const { rows } = await pool.query(
    `SELECT file_name, file_type, file_data FROM invoice_claims WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  return rows[0];
};

module.exports = { ensureTable, create, findByUser, findFileById };
