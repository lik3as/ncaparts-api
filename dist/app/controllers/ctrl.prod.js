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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const srv_prod_1 = __importDefault(require("../services/srv.prod"));
const ctrl = new srv_prod_1.default();
const on_error = (err) => {
    console.log('An error occured while trying to access Products route: \n' +
        `\x1b[31m${err}\x1b[0m`);
};
exports.default = {
    /**
     * @returns Fifty latest products ordered by name
     */
    latest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json(yield ctrl.getAllBodies().catch(on_error));
        });
    },
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.get('categoria') != undefined) {
                next('route');
            }
            res.json({ 'placeholder': 'placeholder' });
        });
    },
    create_categoria(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctrl.createCategoria(req.get('categoria'), req.body).catch(on_error);
            res.json({ 'placeholder': 'placeholder' });
        });
    },
    get_categorias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json(yield ctrl.getCategorias('Tipo').catch(on_error));
        });
    }
};
