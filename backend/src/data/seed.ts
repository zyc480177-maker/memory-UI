import bcrypt from 'bcryptjs';
import { pool, queryOne, testConnection } from './db';
import { config } from '../config';

async function seed() {
  await testConnection();

  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM account_users WHERE email = $1',
    [config.auth.ownerEmail]
  );

  if (existing) {
    console.log(`[Seed] Owner already exists: ${config.auth.ownerEmail}`);
    await pool.end();
    return;
  }

  const hash = await bcrypt.hash(config.auth.ownerPassword, 12);
  const rows = await pool.query<{ id: string }>(
    `INSERT INTO account_users (email, password_hash, display_name, status)
     VALUES ($1, $2, $3, 'active') RETURNING id`,
    [config.auth.ownerEmail, hash, 'Owner']
  );

  console.log(`[Seed] Owner created: ${config.auth.ownerEmail} (id: ${rows.rows[0].id})`);
  await pool.end();
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err.message);
  process.exit(1);
});
