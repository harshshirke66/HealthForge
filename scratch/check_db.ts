import { query } from '../src/lib/config';

async function checkTable() {
  try {
    const res = await query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sleep_logs');`);
    console.log('Sleep logs table exists:', res.rows[0].exists);
    
    if (res.rows[0].exists) {
      const columns = await query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sleep_logs';`);
      console.log('Columns:', columns.rows);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error checking table:', err);
    process.exit(1);
  }
}

checkTable();
