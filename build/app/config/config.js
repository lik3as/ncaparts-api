"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv");
const fs = require('fs');
const config = {
    production: {
        username: 'postgres',
        password: 'PSQLROOT5432',
        database: 'ncaparts',
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
    }
};
exports.default = config;
