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
exports.Kit = void 0;
const index_1 = require("./index");
const sequelize_typescript_1 = require("sequelize-typescript");
let Kit = class Kit extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Kit.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Kit.prototype, "apelido", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => index_1.Mercadoria),
    __metadata("design:type", Array)
], Kit.prototype, "mercadorias", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => index_1.Produto, () => index_1.ProdKit),
    __metadata("design:type", Array)
], Kit.prototype, "produtos", void 0);
Kit = __decorate([
    sequelize_typescript_1.Table
], Kit);
exports.Kit = Kit;
