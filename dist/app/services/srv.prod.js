"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importStar(require("../models/index"));
class ProdutoCtrl {
    constructor() { }
    getBodies({ method, on, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            return (typeof args == undefined) ?
                index_1.Produto.scope({ method: `${method}${on}` }).findAll()
                :
                    index_1.Produto.scope({ method: [`${method}${on}`, args] }).findAll();
        });
    }
    getBody({ method, on, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (method != 'find_by_')
                throw new Error("Este método retorna uma lista.");
            return index_1.Produto.scope({ method: [`${method}${on}`, args] }).findOne();
        });
    }
    getAllBodies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_1.Produto.findAll({
                order: [
                    index_1.default.fn('concat', index_1.default.col('id_tipo'), index_1.default.col('id_subtipo'), index_1.default.col('id_marca'), index_1.default.col('id_modelo'), index_1.default.col('id_versao'))
                ]
            });
        });
    }
    createCategoria(categoria, body) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (categoria) {
                case ('Tipo'):
                    yield index_1.Tipo.create(body);
                    break;
                case ('Subtipo'):
                    yield index_1.Subtipo.create(body);
                    break;
                case ('Marca'):
                    yield index_1.Marca.create(body);
                    break;
                case ('Modelo'):
                    yield index_1.Modelo.create(body);
                    break;
                case ('Versao'):
                    yield index_1.Versao.create(body);
                    break;
                default:
                    yield index_1.Tipo.create(body);
                    break;
            }
        });
    }
    getCategorias(categoria) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (categoria) {
                case ('Tipo'):
                    return yield index_1.Tipo.findAll();
                case ('Subtipo'):
                    return yield index_1.Subtipo.findAll();
                case ('Marca'):
                    return yield index_1.Marca.findAll();
                case ('Modelo'):
                    return yield index_1.Modelo.findAll();
                case ('Versao'):
                    return yield index_1.Versao.findAll();
                default:
                    return yield index_1.Tipo.findAll();
            }
        });
    }
}
exports.default = ProdutoCtrl;
