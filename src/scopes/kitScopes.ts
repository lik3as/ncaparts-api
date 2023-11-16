import { ScopesOptionsGetter } from "./utilScopes";
import { FindOptions, Op } from "sequelize";

const kitScopes: ScopesOptionsGetter = () => ({
  find_unique(nome: string): FindOptions {
    return {
      where: {
        nome: {
          [Op.like]: nome
        }
      }
    }
  }
})

export default kitScopes;