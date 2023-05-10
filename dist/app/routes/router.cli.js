"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl_cli_1 = __importDefault(require("../controllers/ctrl.cli"));
const router = (0, express_1.Router)();
router.post('/cli', ctrl_cli_1.default.create);
router.get('/cli', ctrl_cli_1.default.all);
exports.default = router;
