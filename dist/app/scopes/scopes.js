"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fab_scopes = exports.prod_scopes = void 0;
/*
*   Dentro dos scopes será aplicada até uma subquery por
*   scope. Caso seja necessário fazer uma pesquisa com mais
*   de um subquery, apenas utilize os finders.
*/
var scope_prod_1 = require("./scope_prod");
Object.defineProperty(exports, "prod_scopes", { enumerable: true, get: function () { return scope_prod_1.prod_scopes; } });
var scope_fab_1 = require("./scope_fab");
Object.defineProperty(exports, "fab_scopes", { enumerable: true, get: function () { return scope_fab_1.fab_scopes; } });
