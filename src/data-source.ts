import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import databaseConfig from './config/database.config';

const config = databaseConfig() as DataSourceOptions;

export const AppDataSource = new DataSource({
  ...config,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
