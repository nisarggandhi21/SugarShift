const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  await pool.query("SELECT 1");
  console.log("PostgreSQL (Neon) connected");
};

module.exports = { pool, connectDB };
