import {ScopesOptionsGetter} from './utilScopes'
import {FindOptions, Op} from 'sequelize'

const cliScopes: ScopesOptionsGetter = () => ({ 
    find_unique(email: string): FindOptions{
      return{
        where: {
          email: {
            [Op.like]: email
          }
        }
      }
    },
});

export default cliScopes;