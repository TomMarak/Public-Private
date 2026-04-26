import dotenv from 'dotenv';
import { Pool, type PoolConfig } from 'pg';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in the environment');
}

const poolConfig: PoolConfig = {
  connectionString: databaseUrl,
};

export const pool = new Pool(poolConfig);

export const getDatabaseUrl = () => databaseUrl;

export const query = async <T extends object = any>(text: string, params?: unknown[]) => {
  const result = await pool.query<T>(text, params);
  return result;
};

export const initializeDatabase = async () => {
  const client = await pool.connect();
  client.release();
  return pool;
};

export const closeDatabase = async () => {
  await pool.end();
};
