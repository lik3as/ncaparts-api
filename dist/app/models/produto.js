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
var Produto_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const scopes_1 = require("../scopes/scopes");
const index_1 = require("./index");
const sequelize_typescript_1 = require("sequelize-typescript");
/*
    * Os primeiros três conjuntos de associação servem para
    * classificar o produto como no seguinte exemplo:
    * Eletrônico -> Tipo
    * Subtitipo -> Celular
    * Samsung -> Marca
    * S10 -> Modelo
*/
let Produto = Produto_1 = class Produto extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Produto_1),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_prod", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Produto_1),
    __metadata("design:type", Produto
    /*
    *   OneToMany Product Spec Associations
    */
    )
], Produto.prototype, "produto", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Tipo),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_tipo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Subtipo),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_subtipo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Marca),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_marca", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Modelo),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_modelo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => index_1.Versao),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Produto.prototype, "id_versao", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => index_1.Mercadoria),
    __metadata("design:type", Array)
], Produto.prototype, "mercadorias", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "sku", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Produto.prototype, "final", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Produto.prototype, "desc", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => index_1.Fabricante, () => index_1.ProdFab, 'id_prod', 'id_fab'),
    __metadata("design:type", Array)
], Produto.prototype, "fabricantes", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => index_1.Kit, () => index_1.ProdKit, 'id_prod', 'id_kit'),
    __metadata("design:type", Array)
], Produto.prototype, "kits", void 0);
Produto = Produto_1 = __decorate([
    (0, sequelize_typescript_1.Scopes)(scopes_1.prod_scopes)
    /*
    *   Categories are:
    *   tipo, subtipo, marca and modelo
    */
    ,
    sequelize_typescript_1.Table
], Produto);
exports.Produto = Produto;
