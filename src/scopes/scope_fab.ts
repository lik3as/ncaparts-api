import {join} from './scope-types'
import {ProdFab} from '../models/index'
import {Sequelize, Op} from 'sequelize'

export default () => {
  const sequelize: Sequelize = new Sequelize();
  return {
    
    /* 
    * @param fk_prod -> foreign key of ProdFab table
    */
    join_in_prod(fk_prod: number): join{
      return {
        include: [{
          model: ProdFab,
          required: true,
          where: {
            id: {
              [Op.in]: sequelize.literal(
                `SELECT id_fab FROM ProdFab
                 WHERE id_prod = ${fk_prod};`
            )}
          }
        }]
      }
    }
  }
}