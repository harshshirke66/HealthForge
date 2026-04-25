const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log('Running SQL...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sleep_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        sleep_time TIMESTAMP NOT NULL,
        wake_time TIMESTAMP NOT NULL,
        quality INTEGER DEFAULT 3,
        logged_at DATE DEFAULT CURRENT_DATE,
        UNIQUE(user_id, logged_at)
      );
    `);
    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
