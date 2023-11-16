import { Attributes, Model, ModelStatic } from "sequelize";
import RW from "../contracts/RW";
import { args, findParam, joinParam, methodParam } from "../contracts/params";

export default abstract class Service<
T extends Model,
> implements RW<T> {
  Model: ModelStatic<T>;
  
  constructor (ModelRef: ModelStatic<T>) {
    this.Model = ModelRef;
  }

  useScope({ method, param, args }: findParam & args): ModelStatic<T>;
  useScope({ method, param, args }: joinParam & args): ModelStatic<T>;
  useScope({ method, param, args }: methodParam): ModelStatic<T>{
    try { 
      //sequelize-typescript bug -> despite this.Model.scope returns a ModelCtor<T>, you need to use ModelStatic<T>
      return this.Model.scope({ method: [`${method}_${param}`, args] });
    } catch (e) {
      throw new Error(`useScope method, parent of ${this.Model.getTableName()}, method: ${method}, param: ${param} ->` + e);
    }
  }
  
  async getAttr(name: string): Promise<Attributes<T>[]> {
    return await this.Model.findAll({ attributes: [name], raw: true }) as {}[] as Attributes<T>[];
  }

  async records() {
    return await this.Model.count();
  }
}