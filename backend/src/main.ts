import { config } from './config';
import { testConnection } from './data/db';
import app from './app';

async function start() {
  try {
    await testConnection();
  } catch (err) {
    console.error('[DB] Connection failed:', (err as Error).message);
    console.error('[DB] Make sure PostgreSQL is running and DATABASE_URL is correct.');
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[Server] MEMOIRS backend running on http://localhost:${config.port}`);
    console.log(`[Server] Environment: ${config.nodeEnv}`);
    console.log(`[Server] AI provider: ${config.ai.defaultProvider}`);
  });
}

start();
