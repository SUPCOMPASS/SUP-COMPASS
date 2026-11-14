import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString ? { connectionString } : {}
);

export async function checkDatabaseConnection(): Promise<void> {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  await pool.query('SELECT 1');
}

pool.on('error', (error: Error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});