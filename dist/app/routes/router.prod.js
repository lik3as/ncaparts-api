"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl_prod_1 = __importDefault(require("../controllers/ctrl.prod"));
const router = (0, express_1.Router)();
router.get('/prod', ctrl_prod_1.default.latest);
router.get('/prod/cat', ctrl_prod_1.default.get_categorias);
router.post('/prod/cat', ctrl_prod_1.default.create_categoria);
exports.default = router;
