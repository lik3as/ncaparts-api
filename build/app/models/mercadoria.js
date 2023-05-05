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
exports.Mercadoria = void 0;
const index_1 = require("./index");
const sequelize_typescript_1 = require("sequelize-typescript");
let Mercadoria = class Mercadoria extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Mercadoria.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Produto),
    __metadata("design:type", Number)
], Mercadoria.prototype, "id_prod", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Kit),
    __metadata("design:type", Number)
], Mercadoria.prototype, "id_kit", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => index_1.Produto),
    __metadata("design:type", index_1.Produto)
], Mercadoria.prototype, "produto", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => index_1.Kit),
    __metadata("design:type", index_1.Kit)
], Mercadoria.prototype, "kit", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Mercadoria.prototype, "sku", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Mercadoria.prototype, "importado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL({ precision: 10, scale: 2 })),
    __metadata("design:type", Number)
], Mercadoria.prototype, "v_real", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL({ precision: 10, scale: 2 })),
    __metadata("design:type", Number)
], Mercadoria.prototype, "v_dolar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL({ precision: 10, scale: 2 })),
    __metadata("design:type", Number)
], Mercadoria.prototype, "v_real_revenda", void 0);
Mercadoria = __decorate([
    sequelize_typescript_1.Table
], Mercadoria);
exports.Mercadoria = Mercadoria;
