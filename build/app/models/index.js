"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Versao = exports.Tipo = exports.Subtipo = exports.Produto = exports.ProdKit = exports.ProdFab = exports.Modelo = exports.Mercadoria = exports.Marca = exports.Logistica = exports.Kit = exports.Fabricante = exports.Venda = exports.Cliente = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = __importDefault(require("../config/config"));
class Database {
    constructor() {
        this.connect();
        this.sync();
    }
    connect() {
        console.log(config_1.default.production);
        try {
            this.connection = new sequelize_typescript_1.Sequelize(config_1.default.production.database, config_1.default.production.username, config_1.default.production.password, {
                host: config_1.default.production.host,
                dialect: config_1.default.production.dialect,
                port: config_1.default.production.port
            });
        }
        catch (e) {
            console.log(e);
        }
        finally {
            this.connection.close();
        }
    }
    sync() {
        this.connection.sync({ force: true });
    }
    get sequelize() {
        return this.connection;
    }
}
const db = new Database();
exports.default = db;
/*
*   Declaring Scopes and it dependencies again for changing the
*   return options to the newly created type 'scope'
*/
var cliente_1 = require("./cliente");
Object.defineProperty(exports, "Cliente", { enumerable: true, get: function () { return cliente_1.Cliente; } });
var venda_1 = require("./venda");
Object.defineProperty(exports, "Venda", { enumerable: true, get: function () { return venda_1.Venda; } });
var fabricante_1 = require("./fabricante");
Object.defineProperty(exports, "Fabricante", { enumerable: true, get: function () { return fabricante_1.Fabricante; } });
var kit_1 = require("./kit");
Object.defineProperty(exports, "Kit", { enumerable: true, get: function () { return kit_1.Kit; } });
var logistica_1 = require("./logistica");
Object.defineProperty(exports, "Logistica", { enumerable: true, get: function () { return logistica_1.Logistica; } });
var marca_1 = require("./marca");
Object.defineProperty(exports, "Marca", { enumerable: true, get: function () { return marca_1.Marca; } });
var mercadoria_1 = require("./mercadoria");
Object.defineProperty(exports, "Mercadoria", { enumerable: true, get: function () { return mercadoria_1.Mercadoria; } });
var modelo_1 = require("./modelo");
Object.defineProperty(exports, "Modelo", { enumerable: true, get: function () { return modelo_1.Modelo; } });
var prod_fab_1 = require("./prod_fab");
Object.defineProperty(exports, "ProdFab", { enumerable: true, get: function () { return prod_fab_1.ProdFab; } });
var prod_kit_1 = require("./prod_kit");
Object.defineProperty(exports, "ProdKit", { enumerable: true, get: function () { return prod_kit_1.ProdKit; } });
var produto_1 = require("./produto");
Object.defineProperty(exports, "Produto", { enumerable: true, get: function () { return produto_1.Produto; } });
var subtipo_1 = require("./subtipo");
Object.defineProperty(exports, "Subtipo", { enumerable: true, get: function () { return subtipo_1.Subtipo; } });
var tipo_1 = require("./tipo");
Object.defineProperty(exports, "Tipo", { enumerable: true, get: function () { return tipo_1.Tipo; } });
var versao_1 = require("./versao");
Object.defineProperty(exports, "Versao", { enumerable: true, get: function () { return versao_1.Versao; } });
