"use strict";
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
const index_1 = require("../models/index");
class FabricanteCtrl {
    constructor() { }
    getBodies({ method, on, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            return (typeof args == undefined) ?
                yield index_1.Fabricante.scope({ method: `${method}${on}` }).findAll()
                :
                    yield index_1.Fabricante.scope({ method: [`${method}${on}`, args] }).findAll();
        });
    }
    getBody({ method, on, args }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(method + on + `(${args})`);
            if (method != 'find_by_')
                throw new Error("Este método retorna uma lista.");
            return yield index_1.Fabricante.scope({ method: [`${method}${on}`, args] }).findOne();
        });
    }
}
exports.default = FabricanteCtrl;
