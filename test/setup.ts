import * as path from 'path';

// Runs before any test module is imported, so these env vars are in place
// before `ConfigModule.forRoot()` loads `.env` (which would otherwise point
// the test suite at the developer's local.sqlite).
process.env.DB_TYPE = process.env.DB_TYPE || 'sqlite';
if (process.env.DB_TYPE === 'sqlite') {
  process.env.DB_SQLITE_PATH =
    process.env.DB_SQLITE_PATH || path.resolve(__dirname, '.test-e2e.sqlite');
}
