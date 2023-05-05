"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prod_scopes = void 0;
const index_1 = __importDefault(require("../models/index"));
const index_2 = require("../models/index");
const sequelize_1 = require("sequelize");
const sequelize = index_1.default.sequelize;
const prod_scopes = () => ({
    find_by_id(id) {
        return {
            where: {
                id: {
                    [sequelize_1.Op.eq]: id
                }
            }
        };
    },
    join_in_prod(is_final_prod) {
        return {
            include: {
                model: index_2.Produto,
                required: true,
                where: {
                    final: {
                        [sequelize_1.Op.eq]: true
                    }
                }
            }
        };
    },
    join_in_tipo(fk_tipo) {
        return {
            include: {
                model: index_2.Tipo,
                required: true,
                where: {
                    id_tipo: {
                        [sequelize_1.Op.eq]: fk_tipo
                    }
                }
            }
        };
    },
    join_in_subtipo(fk_subtipo) {
        return {
            include: {
                model: index_2.Subtipo,
                required: true,
                where: {
                    id_subtitpo: {
                        [sequelize_1.Op.eq]: fk_subtipo
                    }
                }
            }
        };
    },
    join_in_marca(fk_marca) {
        return {
            include: {
                model: index_2.Marca,
                required: true,
                where: {
                    id_marca: {
                        [sequelize_1.Op.eq]: fk_marca
                    }
                }
            }
        };
    },
    join_in_modelo(fk_modelo) {
        return {
            include: {
                model: index_2.Modelo,
                required: true,
                where: {
                    id_modelo: {
                        [sequelize_1.Op.eq]: fk_modelo
                    }
                }
            }
        };
    },
    join_in_merc(fk_merc) {
        return {
            include: {
                model: index_2.Mercadoria,
                required: true,
                where: {
                    id_merc: { [sequelize_1.Op.eq]: fk_merc }
                }
            }
        };
    },
    join_in_versao(fk_vers) {
        return {
            include: {
                model: index_2.Versao,
                required: true,
                where: {
                    id_vers: { [sequelize_1.Op.eq]: fk_vers }
                }
            }
        };
    },
    join_in_categories(nome_tipo, nome_subtipo, nome_marca, nome_modelo) {
        return {
            include: [{
                    model: index_2.Tipo,
                    required: true,
                    where: {
                        id_tipo: {
                            [sequelize_1.Op.eq]: sequelize.literal(`SELECT id FROM Tipo ` +
                                `WHERE nome = ${nome_tipo};`)
                        }
                    }
                }, {
                    model: index_2.Subtipo,
                    required: true,
                    where: {
                        id_subtipo: {
                            [sequelize_1.Op.eq]: sequelize.literal(`SELECT id FROM Subtipo ` +
                                `WHERE nome = ${nome_subtipo};`)
                        }
                    }
                }, {
                    model: index_2.Marca,
                    required: true,
                    where: {
                        id_marca: {
                            [sequelize_1.Op.eq]: sequelize.literal(`SELECT id FROM Marca ` +
                                `WHERE nome = ${nome_marca};`)
                        }
                    }
                }, {
                    model: index_2.Modelo,
                    required: true,
                    where: {
                        id_modelo: {
                            [sequelize_1.Op.eq]: sequelize.literal(`SELECT id FROM Modelo ` +
                                `WHERE nome = ${nome_modelo};`)
                        }
                    }
                }]
        };
    }
});
exports.prod_scopes = prod_scopes;
