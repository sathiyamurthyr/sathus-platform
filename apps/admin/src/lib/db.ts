import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __analyticsPool: Pool | undefined;
}

function getPool(): Pool {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Define it in your environment (.env.local).');
  }
  if (!global.__analyticsPool) {
    global.__analyticsPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return global.__analyticsPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const start = Date.now();
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return result.rows as T[];
  } finally {
    if (process.env.NODE_ENV !== 'production') {
      // Lightweight query timing log for local performance tuning.
      console.debug(`[sql] ${Date.now() - start}ms`);
    }
  }
}
