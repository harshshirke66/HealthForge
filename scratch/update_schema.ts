import { query } from '../src/lib/config';

async function updateSchema() {
  try {
    console.log('Adding category column to meals table...');
    await query(`
      ALTER TABLE meals ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Other';
    `);
    console.log('Schema updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating schema:', err);
    process.exit(1);
  }
}

updateSchema();
