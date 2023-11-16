import { Produto, Tipo, Marca, Modelo, Grupo, Fabricante, Mercadoria } from "../models/index";
import Filterable from "../contracts/Filterable";
import Controller from "./Controller";
import { CreationAttributes } from "sequelize";
import Database from "../models/index";


export { Produto, Tipo, Marca, Modelo, Grupo };
export default class ProdutoCtrl extends Controller<Produto> implements Filterable<Produto> {

  constructor () {
    super(Produto);
  }

  async filter(instances: CreationAttributes<Produto>[]): Promise<CreationAttributes<Produto>[]>{
    const prodMap = await Promise.all(
    instances.map(
      async (prod) =>
      await this.findByUnique(prod.SKU) == null
    )
    );
  
    return instances.filter((_, i) => prodMap[i]); 
  }

  async findByUnique(unique: string): Promise<Produto | null>{
    return await this.useScope({
      method: 'find',
      param: 'unique',
      args: unique
    }).findOne();
  }

  async records(): Promise<number> {
    return await Produto.count();
  }

  public async getSome(limit: number = 15, offset: number = 0): Promise<Produto[]> {
    const LIMIT: number = limit;

    return await Produto.findAll(
      {
        include: [
          Produto,
          Tipo,
          Grupo,
          Marca,
          Modelo,
          Fabricante,
          Mercadoria
        ]
        ,
        subQuery: false,
        limit: LIMIT,
        offset: offset
      },
    )
  }


  static get skeleton() {
    return Produto;
  }


  async getIdByUnique(unique: string): Promise<number | undefined> {
    const instance = await this.findByUnique(unique);
    return instance?.id;
  }

  static async createAndAssociate(instanceToCreate: CreationAttributes<Produto> | CreationAttributes<Produto>[]): Promise<Produto[]> {
    try {
      return await Promise.all((Array.isArray(instanceToCreate) ? instanceToCreate : [instanceToCreate]).map( async (instance) => {
        return await Database.sequelize.transaction(async (t) => {

          if (!instance.tipos || !instance.marcas || !instance.grupos || !instance.modelos)
          throw new Error("You tried to associate a product without it's associations.");

          const produto = await Produto.create(instance, {transaction: t});

          await produto.$add("tipos", instance.tipos, {transaction: t});
          await produto.$add("marcas", instance.marcas, {transaction: t});
          await produto.$add("grupos", instance.grupos, {transaction: t});
          await produto.$add("modelos", instance.modelos, {transaction: t});

          const mercadoria = instance.mercadoria.get({plain: true});
          await Mercadoria.create({...mercadoria, fk_produto: produto.id}, {transaction: t});

          return produto;
        })

      }))
    } catch (e) {
      throw e;
    }
  }
}