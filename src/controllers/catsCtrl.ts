import { CreationAttributes, ModelStatic } from "sequelize";
import { Grupo, Marca, Modelo, Tipo } from "../models";

export { Grupo, Marca, Modelo, Tipo };

export default class CategoriasCtrl {
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


  private async filterCatUniques(body: CreationAttributes<Tipo>[], cats: ModelStatic<Tipo | Grupo | Modelo | Marca>): Promise<CreationAttributes<Tipo>[]> {
    const filtered_map = await Promise.all(
      body.map(async (cat) => {
        return (await cats.findOne({
          where: {
            nome: cat.nome
          }
        })) == null
      })
    )

    return body.filter((_, i) => filtered_map[i])
  }

  public async createCategoria(categoria: "Tipos" | "Marcas" | "Modelos" | "Grupos", body: CreationAttributes<Tipo>[] | CreationAttributes<Tipo>[])
  : Promise<(Tipo | Grupo | Marca | Modelo)[] | (Tipo | Grupo | Marca | Modelo) | null> {
    switch (categoria) {
      case ('Tipos'): {
        const filtered = await this.filterCatUniques(body, Tipo)

        if (Array.isArray(filtered)) {
          return await Tipo.bulkCreate(filtered)
        } else {
          return (filtered)
            ? await Tipo.create(filtered, { raw: true })
            : null;

        }
      }
      case ('Grupos'): {
        const filtered = await this.filterCatUniques(body, Grupo)

        if (Array.isArray(filtered)) {
          return await Grupo.bulkCreate(filtered)
        } else {
          return (filtered)
            ? await Grupo.create(filtered, { raw: true })
            : null;

        }
      }
      case ('Marcas'): {
        const filtered = await this.filterCatUniques(body, Marca)

        if (Array.isArray(filtered)) {
          return await Marca.bulkCreate(filtered)
        } else {
          return (filtered)
            ? await Marca.create(filtered, { raw: true })
            : null;

        }
      }
      case ('Modelos'): {
        const filtered = await this.filterCatUniques(body, Modelo)

        if (Array.isArray(filtered)) {
          return await Modelo.bulkCreate(filtered)
        } else {
          return (filtered)
            ? await Modelo.create(filtered, { raw: true })
            : null;
        }
      }
      default:
        throw new Error(categoria + " it's not a table.");
    }
  }

  public async getCats(categoria: "Tipos" | "Grupos" | "Marcas" | "Modelos"): Promise<(Tipo | Grupo | Marca | Modelo)[]> {
    switch (categoria) {
      case ('Tipos'): {
        return await Tipo.findAll({ raw: true });

      }
      case ('Grupos'): {
        return await Grupo.findAll({ raw: true });

      }
      case ('Marcas'): {
        return await Marca.findAll({ raw: true })

      }
      case ('Modelos'): {
        return await Modelo.findAll({ raw: true })

      }
      default:
        throw new Error(categoria + " it's not a table.");
    }
  }

  public async getCatId(categoria: "Tipos" | "Grupos" | "Marcas" | "Modelos", nome: string): Promise<number | undefined> {
    if (nome == undefined) return undefined;
    switch (categoria) {
      case ('Tipos'): {
        const tipo = (await Tipo.findOne({
          where: {
            nome: nome
          },
          attributes: ['id']
        }));

        tipo?.id
      }

      case ('Grupos'): {
        const grupo = (await Grupo.findOne({
          where: {
            nome: nome,
          },
          attributes: ['id']
        }));

        return grupo?.id;
      }

      case ('Marcas'): {
        const marca = await Marca.findOne({
          where: {
            nome: nome,
          },
          attributes: ['id']
        });

        return marca?.id;
      }

      case ('Modelos'): {
        const modelo = (await Modelo.findOne({
          where: {
            nome: nome,
          },
          attributes: ['id']
        }))

        return modelo?.id;
      }
      default:
        throw new Error(categoria + " it's not a table.");
    }
  }
}