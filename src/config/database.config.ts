import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const environment = (process.env.NODE_ENV || 'development').toLowerCase();
const isProd = environment === 'production';
const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

const toBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

// SQLite is for local dev/tests and uses synchronize. Postgres (prod) relies on
// migrations so the schema is versioned and repeatable.
const synchronize = toBool(
  process.env.DB_SYNCHRONIZE,
  dbType !== 'postgres',
);
const migrationsRun = toBool(
  process.env.DB_MIGRATIONS_RUN,
  dbType === 'postgres',
);
const logging = toBool(process.env.DB_LOGGING, false);

export default registerAs('database', (): TypeOrmModuleOptions => {
  const common = {
    autoLoadEntities: true,
    synchronize,
    migrationsRun,
    migrationsTableName: 'migrations',
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    logging,
  };

  if (dbType === 'sqlite') {
    return {
      ...common,
      type: 'sqlite',
      database: process.env.DB_SQLITE_PATH || './local.sqlite',
    } as TypeOrmModuleOptions;
  }

  const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (databaseUrl) {
    return {
      ...common,
      type: 'postgres',
      url: databaseUrl,
      ssl: toBool(process.env.DB_SSL, databaseUrl.includes('render.com') || databaseUrl.includes('rds.amazonaws.com'))
        ? { rejectUnauthorized: false }
        : false,
    } as TypeOrmModuleOptions;
  }

  return {
    ...common,
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'fullstacktest',
    ssl: toBool(process.env.DB_SSL, false)
      ? { rejectUnauthorized: false }
      : false,
  } as TypeOrmModuleOptions;
});
