const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Restoring category...');
    await pool.query(`
      UPDATE meals 
      SET category = 'Breakfast' 
      WHERE logged_at::date = CURRENT_DATE AND category = 'Other';
    `);
    console.log('Update successful!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
