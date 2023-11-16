import {ScopesOptionsGetter} from './utilScopes'
import {FindOptions, Op } from 'sequelize'


const fabScopes: ScopesOptionsGetter = () => ({ 
    find_id(id: number): FindOptions{
      return{
        where: {
          id: {
            [Op.eq]: id
          }
        }
      }
    },
    find_unique(nome: string): FindOptions{
      return {
        where: {
          nome: {
            [Op.like]: nome
          }
        }
      }
    },
})

export default fabScopes;