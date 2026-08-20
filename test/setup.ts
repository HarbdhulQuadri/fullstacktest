import * as path from 'path';

// Runs before any test module is imported, so these env vars are in place
// before `ConfigModule.forRoot()` loads `.env` (which would otherwise point
// the test suite at the developer's local.sqlite).
process.env.DB_TYPE = process.env.DB_TYPE || 'sqlite';
if (process.env.DB_TYPE === 'sqlite') {
  process.env.DB_SQLITE_PATH =
    process.env.DB_SQLITE_PATH || path.resolve(__dirname, '.test-e2e.sqlite');
}

// Seed an admin used by the JWT-protected API during the test run.
process.env.ADMIN_SEED_EMAIL = process.env.ADMIN_SEED_EMAIL || 'test-admin@example.com';
process.env.ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'test-password-123';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

