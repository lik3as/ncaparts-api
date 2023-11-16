import { Mercadoria, Produto, Kit, Tipo, Grupo, Marca, Modelo, Fabricante } from "../models/index";
import Filterable from "../contracts/Filterable";

import Service from "./Service";
import { CreationAttributes } from "sequelize";


export { Mercadoria }
export default class MerchandiseService extends Service<Mercadoria> implements Filterable<Mercadoria>{

  constructor() {
    super(Mercadoria);
  }

  async filter(mercs: CreationAttributes<Mercadoria>[]): Promise<CreationAttributes<Mercadoria>[]> {
    const mercMap = await Promise.all(
      mercs.map(
        async (merc) => {
          return await this.findByUnique(
            (merc.fk_produto || merc.produto?.SKU)!
          ) == null
        }
      )
    );
    return mercs.filter((_, i) => mercMap[i]);
  }

  async findByUnique(unique: number | string): Promise<Mercadoria | null> {
    return await this.useScope({
      method: 'find',
      param: 'unique',
      args: unique
    }).findOne();
  }

  async getSome(limit: number = 15, offset: number = 0): Promise<Mercadoria[]> {
    return await Mercadoria.findAll({
      attributes: { exclude: ["updatedAt", "createdAt"] },
      include: [{
        model: Produto,
        as: 'produto',
        include: [
          Produto,
          Tipo,
          Grupo,
          Marca,
          Modelo,
          Fabricante
        ],
      }, 
        Kit,
      ],
      subQuery: false,
      limit: limit,
      offset: offset
    });
  }

  static get skeleton() {
    return Mercadoria;
  }

  async getIdByUnique(unique: number): Promise<number | undefined> {
    const instance = await this.findByUnique(unique);

    return (instance)
      ? instance.id
      : undefined;
  }
}
