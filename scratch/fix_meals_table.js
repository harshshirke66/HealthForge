const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Updating meals table with category column...');
    await pool.query(`
      ALTER TABLE meals ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Other';
    `);
    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
