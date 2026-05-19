/**
 * Postgres connection pool for REP.
 * Uses DATABASE_URL from environment (set in Vercel or .env.local).
 *
 * Required env var:
 *   DATABASE_URL=postgresql://user:password@host:5432/rep_db
 *
 * Pool is lazily initialized on first query so the build succeeds
 * even when DATABASE_URL is not present at build time.
 */
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function getPool(): Pool {
  if (global._pgPool) return global._pgPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  global._pgPool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return global._pgPool;
}

// Proxy delays pool creation until the first .query() / .connect() call,
// so importing this module never throws at build time.
const pool = new Proxy({} as Pool, {
  get(_target, prop) {
    return (getPool() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default pool;
