import { query } from '../src/lib/config';

async function updateSchema() {
  try {
    console.log('Creating sleep_logs table...');
    await query(`
      CREATE TABLE IF NOT EXISTS sleep_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        sleep_time TIMESTAMP NOT NULL,
        wake_time TIMESTAMP NOT NULL,
        quality INTEGER DEFAULT 3, -- 1 to 5
        logged_at DATE DEFAULT CURRENT_DATE,
        UNIQUE(user_id, logged_at)
      );
    `);
    console.log('Schema updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating schema:', err);
    process.exit(1);
  }
}

updateSchema();
