import { CreationAttributes, ModelStatic } from "sequelize";
import { Grupo, Marca, Modelo, Tipo } from "../models";
import { CAT, CAT_STATIC, CAT_TABLE_NAME } from "../constants";

export { Grupo, Marca, Modelo, Tipo };

export default class CategoryService {
  static get tipoSkeleton() {
    return Tipo;
  }

  static get grupoSkeleton() {
    return Grupo;
  }

  static get marcaSkeleton() {
    return Marca;
  }

  static get modeloSkeleton() {
    return Modelo;
  }

  private async filterCatUniques(body: CreationAttributes<Tipo>[], Categoria: ModelStatic<CAT>): Promise<CreationAttributes<Tipo>[]> {
    const filtered_map = await Promise.all(
      body.map(async (cat) => {
        return (await Categoria.findOne({
          where: {
            nome: cat.nome
          }
        })) == null
      })
    )

    return body.filter((_, i) => filtered_map[i])
  }

  public async createCategoria(body: CreationAttributes<Tipo>[] | CreationAttributes<Tipo>, Categoria: ModelStatic<CAT>)
  : Promise<CAT[]> {
    const filtered = await this.filterCatUniques(Array.isArray(body) ? body : [body], Categoria);
    const created = await Categoria.bulkCreate(filtered);

    return created;
  }

  public async getCats(): Promise<CAT[]> {
    return await Tipo.findAll({ raw: true });
  }

  public async getCatId(nome: string, Categoria: CAT_STATIC,): Promise<number | undefined> {
    const tipo = await Categoria.findOne({
      where: {
        nome: nome
      },
      attributes: ['id']
    });

    return tipo?.id
  }
}