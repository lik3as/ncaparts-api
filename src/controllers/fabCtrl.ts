import { Fabricante } from "../models/index";
import Filterable from "../contracts/Filterable";
import Controller from "./Controller";
import { CreationAttributes } from "sequelize";

export { Fabricante };
export default class FabricanteCtrl extends Controller<Fabricante> implements Filterable<Fabricante>{ 

  constructor () {
    super(Fabricante)
  }

  async findByUnique(unique: string | string): Promise<Fabricante | null> {
    return await this.useScope({
      method: 'find',
      param: 'unique',
      args: unique 
    }).findOne(); 
  }

  async filter(instances: CreationAttributes<Fabricante>[]): Promise<CreationAttributes<Fabricante>[]> {
    const fabMap = await Promise.all(
      instances.map(
        async (fab) =>
        await this.findByUnique(
          fab.nome
        ) === null
      )
    );

    return instances.filter((_, i) => fabMap[i]);
  }
  
  static get skeleton(){
    return Fabricante;
  }

  async getIdByUnique(unique: string): Promise<number | undefined> {
    const instance = await this.findByUnique(unique);
    return instance?.id;
  }
}