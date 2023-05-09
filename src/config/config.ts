import { Dialect } from "sequelize";
import path from "path";
import dotenv from 'dotenv'

const nowpath =  path.resolve(__dirname,  '..', '..', '..', 'src', '.env');
console.log(nowpath)

dotenv.config({path: nowpath})

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