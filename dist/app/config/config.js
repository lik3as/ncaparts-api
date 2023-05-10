"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const nowpath = path_1.default.resolve(__dirname, '..', '..', '..', 'src', '.env');
console.log(nowpath);
dotenv_1.default.config({ path: nowpath });
const config = {
    production: {
        username: process.env.DB_PROD_USERNAME,
        password: process.env.DB_PROD_PASSWORD,
        database: process.env.DB_PROD_DATABASE,
        host: process.env.DB_PROD_HOSTNAME,
        port: process.env.DB_PROD_PORT,
        dialect: 'postgres',
    }
};
exports.default = config;
