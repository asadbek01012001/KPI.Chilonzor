import { Pool, PoolClient } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

const pool = new Pool({
  host:     env.db.host,
  port:     env.db.port,
  database: env.db.name,
  user:     env.db.user,
  password: env.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected DB pool error', err);
});

export const db = {
  query: <T = unknown>(text: string, params?: unknown[]) =>
    pool.query<T & Record<string, unknown>>(text, params),

  getClient: (): Promise<PoolClient> => pool.connect(),

  transaction: async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};

export const connectDB = async (): Promise<void> => {
  const client = await pool.connect();
  client.release();
  logger.info('PostgreSQL connected');
};
