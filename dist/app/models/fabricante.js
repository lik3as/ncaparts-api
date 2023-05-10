"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fabricante = void 0;
const scopes_1 = require("../scopes/scopes");
const index_1 = require("./index");
const sequelize_typescript_1 = require("sequelize-typescript");
let Fabricante = class Fabricante extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Fabricante.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Fabricante.prototype, "cnpj", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Fabricante.prototype, "nome", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Fabricante.prototype, "contato", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Fabricante.prototype, "local", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Fabricante.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => index_1.Produto, () => index_1.ProdFab, 'id_fab', 'id_prod'),
    __metadata("design:type", Array)
], Fabricante.prototype, "produtos", void 0);
Fabricante = __decorate([
    (0, sequelize_typescript_1.Scopes)(scopes_1.fab_scopes),
    sequelize_typescript_1.Table
], Fabricante);
exports.Fabricante = Fabricante;
