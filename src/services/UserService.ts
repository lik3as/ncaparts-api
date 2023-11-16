import { Usuario } from "../models/index";
import { fn, col, CreationAttributes } from "sequelize";

import Filterable from "../contracts/Filterable";
import Service from "./Service";

export { Usuario };
export default class UserService extends Service<Usuario> implements Filterable<Usuario> {

  constructor() {
    super(Usuario)
  }

  async findByUnique(unique: string | string): Promise<Usuario | null>{
    return await this.useScope({
      method: 'find',
      param: 'unique',
      args: unique
    }).findOne();
  }

  async filter(instances: CreationAttributes<Usuario>[]): Promise<CreationAttributes<Usuario>[]>{
    const uniquesMap = await Promise.all(
      instances.map(
        async (instance) => {
          return await this.findByUnique(
            instance.email
          ) === null
        })
    );
    return instances.filter((_, i) => uniquesMap[i]);
  }

  public async getAllBodies(): Promise<Usuario[]> {
    return await Usuario.findAll({
      order: [
        fn('concat', col('nome'))
      ]
    });
  }

  static get skeleton(){
    return Usuario;
  }

  async getIdByUnique(unique: string): Promise<number | undefined> {
    const instance = await this.findByUnique(unique);

    return instance?.id
  }

}