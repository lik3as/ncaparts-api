"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kit = exports.Tipo = exports.Versao = exports.Subtipo = exports.Produto = exports.ProdKit = exports.ProdFab = exports.Modelo = exports.Mercadoria = exports.Marca = exports.Logistica = exports.Fabricante = exports.Venda = exports.Cliente = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = __importDefault(require("../config/config"));
const cliente_1 = require("./cliente");
Object.defineProperty(exports, "Cliente", { enumerable: true, get: function () { return cliente_1.Cliente; } });
const venda_1 = require("./venda");
Object.defineProperty(exports, "Venda", { enumerable: true, get: function () { return venda_1.Venda; } });
const fabricante_1 = require("./fabricante");
Object.defineProperty(exports, "Fabricante", { enumerable: true, get: function () { return fabricante_1.Fabricante; } });
const kit_1 = require("./kit");
Object.defineProperty(exports, "Kit", { enumerable: true, get: function () { return kit_1.Kit; } });
const logistica_1 = require("./logistica");
Object.defineProperty(exports, "Logistica", { enumerable: true, get: function () { return logistica_1.Logistica; } });
const marca_1 = require("./marca");
Object.defineProperty(exports, "Marca", { enumerable: true, get: function () { return marca_1.Marca; } });
const mercadoria_1 = require("./mercadoria");
Object.defineProperty(exports, "Mercadoria", { enumerable: true, get: function () { return mercadoria_1.Mercadoria; } });
const modelo_1 = require("./modelo");
Object.defineProperty(exports, "Modelo", { enumerable: true, get: function () { return modelo_1.Modelo; } });
const prod_fab_1 = require("./prod_fab");
Object.defineProperty(exports, "ProdFab", { enumerable: true, get: function () { return prod_fab_1.ProdFab; } });
const prod_kit_1 = require("./prod_kit");
Object.defineProperty(exports, "ProdKit", { enumerable: true, get: function () { return prod_kit_1.ProdKit; } });
const produto_1 = require("./produto");
Object.defineProperty(exports, "Produto", { enumerable: true, get: function () { return produto_1.Produto; } });
const subtipo_1 = require("./subtipo");
Object.defineProperty(exports, "Subtipo", { enumerable: true, get: function () { return subtipo_1.Subtipo; } });
const versao_1 = require("./versao");
Object.defineProperty(exports, "Versao", { enumerable: true, get: function () { return versao_1.Versao; } });
const tipo_1 = require("./tipo");
Object.defineProperty(exports, "Tipo", { enumerable: true, get: function () { return tipo_1.Tipo; } });
class Database {
    constructor() {
        this.connect();
        this.sequelize.authenticate().then(() => {
            console.log('\n\x1b[35mDatabase was connected with Success!\x1b[0m');
        }).catch(err => {
            console.log(err);
        });
    }
    connect() {
        try {
            this.sequelize = new sequelize_typescript_1.Sequelize(config_1.default.production.database, config_1.default.production.username, config_1.default.production.password, {
                host: config_1.default.production.host,
                dialect: config_1.default.production.dialect,
                port: config_1.default.production.port,
                logging: sql => {
                    console.log(`SQL: \x1b[33m ${sql} \x1b[0m`);
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}
const db = new Database();
db.sequelize.addModels([
    cliente_1.Cliente, venda_1.Venda, fabricante_1.Fabricante, kit_1.Kit, logistica_1.Logistica, marca_1.Marca, mercadoria_1.Mercadoria, modelo_1.Modelo,
    prod_fab_1.ProdFab, prod_kit_1.ProdKit, produto_1.Produto, subtipo_1.Subtipo, versao_1.Versao, tipo_1.Tipo
]);
db.sequelize.sync({ force: false });
exports.default = db.sequelize;
