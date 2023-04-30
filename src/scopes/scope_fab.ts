import {join, find} from './scope-types'
import {ProdFab} from '../models/index'
import {Sequelize, Op} from 'sequelize'

export default () => {
  const sequelize: Sequelize = new Sequelize();
  return {
    find_by_id(id: number): find{
      return{
        where: {
          id: {
            [Op.eq]: id
          }
        }
      }
    },
    /* 
    * @param fk_prod -> foreign key da tabela associativa
    */
    join_in_prod(fk_prod: number): join{
      return {
        include: [{
          model: ProdFab,
          required: true,
          where: {
            id: {
              [Op.eq]: sequelize.literal(
                `SELECT id_fab FROM ProdFab
                 WHERE id_prod = ${fk_prod};`
            )}
          }
        }]
      }
    }
  }
}
