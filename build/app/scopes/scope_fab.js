"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fab_scopes = void 0;
const index_1 = __importDefault(require("../models/index"));
const index_2 = require("../models/index");
const sequelize_1 = require("sequelize");
const sequelize = index_1.default;
const fab_scopes = () => ({
    find_by_id(id) {
        return {
            where: {
                id: {
                    [sequelize_1.Op.eq]: id
                }
            }
        };
    },
    /*
    * @param fk_prod -> foreign key da tabela associativa
    */
    join_in_prod(fk_prod) {
        return {
            include: [{
                    model: index_2.ProdFab,
                    required: true,
                    where: {
                        id: {
                            [sequelize_1.Op.eq]: sequelize.literal(`SELECT id_fab FROM ProdFab
                 WHERE id_prod = ${fk_prod};`)
                        }
                    }
                }]
        };
    }
});
exports.fab_scopes = fab_scopes;
