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
exports.Cliente = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Cliente = class Cliente extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Cliente.prototype, "nome", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Cliente.prototype, "contato", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Cliente.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Cliente.prototype, "senha", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Cliente.prototype, "revendedor", void 0);
Cliente = __decorate([
    sequelize_typescript_1.Table
], Cliente);
exports.Cliente = Cliente;
;
