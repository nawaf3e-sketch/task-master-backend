import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

/**
 * TypeORM PostgreSQL Database Configuration
 * This configuration file sets up the database connection for the Task Master Backend application
 */

const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'task_master_db',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true' || process.env.NODE_ENV === 'development',
  entities: [
    resolve(__dirname, '../entities/**/*.entity{.ts,.js}'),
  ],
  migrations: [
    resolve(__dirname, '../migrations/**/*{.ts,.js}'),
  ],
  subscribers: [
    resolve(__dirname, '../subscribers/**/*{.ts,.js}'),
  ],
  extra: {
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.DB_RETRY_DELAY || '3000', 10),
};

/**
 * Create and export the DataSource instance
 * This instance is used for running migrations and database operations
 */
export const AppDataSource = new DataSource(typeOrmConfig);

export default typeOrmConfig;
