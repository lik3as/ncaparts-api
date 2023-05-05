import { Dialect } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})

const config = {
  production: {
    username: process.env.DB_PROD_USERNAME as string, 
    password: process.env.DB_PROD_PASSWORD as string,
    database: process.env.DB_PROD_DATABASE as string,
    host: process.env.DB_PROD_HOSTNAME as string,
    port: process.env.DB_PROD_PORT as unknown,
    dialect: 'postgres' as Dialect,
  }
};

export default config;