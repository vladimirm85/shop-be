import { ClientConfig } from 'pg';

const { PG_HOST, PG_PORT, PG_DB_NAME, PG_USER, PG_PASSWORD } = process.env;

export const bdConfig: ClientConfig = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DB_NAME,
  user: PG_USER,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
