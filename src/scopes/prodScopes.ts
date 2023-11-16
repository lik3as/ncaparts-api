import { ScopesOptionsGetter } from './utilScopes'
import { Produto, Tipo, Grupo, Marca, Modelo } from '../models/index'
import { FindOptions, IncludeOptions, Op, literal, Attributes } from 'sequelize'

export const prodScopes: ScopesOptionsGetter = () => (
  {
    find_unique(unique: string): FindOptions<Attributes<Produto>> {
      return {
        where: {
          SKU: unique,
          [Op.or]: {
            UUID: unique
          }
        },
        include: [
          Tipo,
          Grupo,
          Marca,
          Modelo,
        ],
      }
    },
    join_prod(is_final_prod: boolean): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Produto,
          required: true,
          where: {
            final: {
              [Op.eq]: is_final_prod
            }
          }
        }]
      }
    },
    join_tipo(fk_tipo: number): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Tipo,
          required: true,
          where: {
            fk_tipo: {
              [Op.eq]: fk_tipo
            }
          }
        }]
      }
    },
    join_subtipo(fk_subtipo: number): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Grupo,
          required: true,
          where: {
            fk_subtitpo: {
              [Op.eq]: fk_subtipo
            }
          }
        }]
      }
    },
    join_marca(fk_marca: number): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Marca,
          required: true,
          where: {
            fk_marca: {
              [Op.eq]: fk_marca
            }
          }
        }]
      }
    },
    join_modelo(fk_modelo: number): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Modelo,
          required: true,
          where: {
            fk_modelo: {
              [Op.eq]: fk_modelo
            }
          }
        }]
      }
    },
    join_cats(nome_tipo: string, nome_subtipo: string,
      nome_marca: string, nome_modelo: string): FindOptions<Attributes<Produto>> & IncludeOptions {
      return {
        include: [{
          model: Tipo,
          required: true,
          where: {
            fk_tipo: {
              [Op.eq]: literal(
                `SELECT id FROM Tipo ` +
                `WHERE nome = ${nome_tipo};`
              )
            }
          }
        }, {
          model: Grupo,
          required: true,
          where: {
            fk_subtipo: {
              [Op.eq]: literal(
                `SELECT id FROM Grupo ` +
                `WHERE nome = ${nome_subtipo};`
              )
            }
          }
        }, {
          model: Marca,
          required: true,
          where: {
            fk_marca: {
              [Op.eq]: literal(
                `SELECT id FROM Marca ` +
                `WHERE nome = ${nome_marca};`
              )
            }
          }
        }, {
          model: Modelo,
          required: true,
          where: {
            fk_modelo: {
              [Op.eq]: literal(
                `SELECT id FROM Modelo ` +
                `WHERE nome = ${nome_modelo};`
              )
            }
          }
        }]
      }
    },
  }
)

export default prodScopes;