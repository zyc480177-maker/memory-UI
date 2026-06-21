import fs from 'fs';
import path from 'path';
import { pool, testConnection } from './db';

async function migrate() {
  await testConnection();
  const sql = fs.readFileSync(
    path.resolve(__dirname, 'migrations/001_initial.sql'),
    'utf8'
  );
  await pool.query(sql);
  console.log('[Migrate] Schema applied successfully.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('[Migrate] Failed:', err.message);
  process.exit(1);
});
