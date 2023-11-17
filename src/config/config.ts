import { Dialect }  from "sequelize";
import path from "path";
import dotenv from 'dotenv'

const envpath = path.resolve(__dirname, '..', '..', '.env');

dotenv.config({path: envpath})

const config = {
  production: {
    username: process.env.DB_PROD_USERNAME as string, 
    password: process.env.DB_PROD_PASSWORD as string,
    database: process.env.DB_PROD_DATABASE as string,
    host: process.env.DB_PROD_HOSTNAME as string,
    port: process.env.DB_PROD_PORT as unknown,
    dialect: 'postgres' as Dialect,
  },
  development: {
    username: process.env.DB_DEV_USERNAME as string, 
    password: process.env.DB_DEV_PASSWORD as string,
    database: process.env.DB_DEV_DATABASE as string,
    host: process.env.DB_DEV_HOSTNAME as string,
    port: process.env.DB_DEV_PORT as unknown,
    dialect: 'postgres' as Dialect,
  },
  env: process.env.DESIRED_ENV as 'production' | 'development'
};

export default config;
