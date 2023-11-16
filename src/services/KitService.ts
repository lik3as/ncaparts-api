import { CreationAttributes } from "sequelize";
import Filterable from "../contracts/Filterable";
import { Kit } from "../models/index";
import Service from "./Service";

export { Kit }
export default class KitServices extends Service<Kit> implements Filterable<Kit>{

  constructor(){ 
    super(Kit)
  }

  async findByUnique(unique: string | string): Promise<Kit | null>{
    return await this.useScope({
      method: 'find',
      param: 'unique',
      args: unique 
    }).findOne();
  }
  


  async filter(instances: CreationAttributes<Kit>[]): Promise<CreationAttributes<Kit>[]> {
    const fabMap = await Promise.all(
      instances.map(
        async (kit) =>
        await this.findByUnique(
          kit.nome
        ) === null
      )
    );

    return instances.filter((_, i) => fabMap[i]);
  } 

  static get skeleton(){
    return Kit;
  }

  async getIdByUnique(unique: string): Promise<number | undefined> {
    const instance = await this.findByUnique(unique);
    return instance?.id;
  }
}

