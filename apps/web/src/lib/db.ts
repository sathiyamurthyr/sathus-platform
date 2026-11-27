import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:AivioSathus!321@db.arkoolfygfqawyvwnldv.supabase.co:5432/postgres';

declare global {
  // eslint-disable-next-line no-var
  var __webDbPool: Pool | undefined;
}

function getPool(): Pool {
  if (!global.__webDbPool) {
    global.__webDbPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
      ssl: connectionString.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return global.__webDbPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result.rows as T[];
}
