const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Cleaning up duplicate meals for today...');
    // This SQL identifies duplicates (same name, calories, protein, user_id on the same day) 
    // and keeps only one (the one with the minimum ID).
    await pool.query(`
      DELETE FROM meals 
      WHERE id IN (
        SELECT id 
        FROM (
          SELECT id,
                 ROW_NUMBER() OVER (
                   PARTITION BY user_id, name, calories, protein, logged_at::date 
                   ORDER BY id
                 ) as row_num
          FROM meals
          WHERE logged_at::date = CURRENT_DATE
        ) t
        WHERE t.row_num > 1
      );
    `);
    console.log('Cleanup successful!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
