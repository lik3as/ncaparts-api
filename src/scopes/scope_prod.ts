import { join, find, find_join} from './scope-types'
import { Produto, Tipo, Subtipo, Marca, Modelo, Mercadoria} from '../models/index'
import { Op, Sequelize} from 'sequelize'

export default () => {
  const sequelize: Sequelize = new Sequelize();
  return{
    find_by_id(id: number): join{
      return{
        where: {
          id: {
            [Op.eq]: id
          }
        }
      }
    },
    join_in_prod(is_final_prod: boolean): find_join {
      return {
        include: {
          model: Produto,
          required: true,
          where: {
            final: {
              [Op.eq]: true
            }
          }
        }
      }
    },
    join_in_tipo(fk_tipo: number): find_join {
      return {
        include: {
          model: Tipo,
          required: true,
          where: {
            id_tipo: {
              [Op.like]: fk_tipo
            }
          }
        }
      }
    },
    join_in_subtipo(fk_subtipo: number): find_join {
      return {
        include: {
          model: Subtipo,
          required: true,
          where: {
            id_subtitpo: {
              [Op.like]: fk_subtipo
            }
          }
        }
      }
    },
    join_in_marca(fk_marca: number): find_join {
      return {
        include: {
          model: Marca,
          required: true,
          where: {
            id_marca: {
              [Op.like]: fk_marca
            }
          }
        }
      }
    },
    join_in_modelo(fk_modelo: number): find_join {
      return {
        include: {
          model: Modelo,
          required: true,
          where: {
            id_modelo: {
              [Op.like]: fk_modelo
            }
          }
        }
      }
    },
    join_in_merc(fk_merc: number): find_join {
      return {
        include: {
          model: Mercadoria,
          required: true,
          where: {
            id_merc: { [Op.like]: fk_merc }
          }
        }
      }
    },
    join_in_categories(nome_tipo: number, nome_subtipo: number,
      nome_marca: number, nome_modelo: string): find_join {
        return {
          include: [{
            model: Tipo,
            required: true,
            where: {
              id_tipo: {
                [Op.eq]: sequelize.literal(
                  `SELECT id FROM Tipo ` +
                  `WHERE nome = ${nome_tipo};`
                  )
              }
            }
          }, {
            model: Subtipo,
            required: true,
            where: {
              id_subtipo: {
                [Op.eq]: sequelize.literal(
                  `SELECT id FROM Subtipo ` +
                  `WHERE nome = ${nome_subtipo};`
                )
              }
            }
          }, {
            model: Marca,
            required: true,
            where: {
              id_marca: {
                [Op.eq]: sequelize.literal(
                  `SELECT id FROM Marca ` +
                  `WHERE nome = ${nome_marca};`
                )
              }
            }
          }, {
            model: Modelo,
            required: true,
            where: {
              id_modelo: {
                [Op.eq]: sequelize.literal(
                  `SELECT id FROM Modelo `+
                  `WHERE nome = ${nome_modelo};`
                  )
              }
            }
          }]
        }
      }
  }
}
