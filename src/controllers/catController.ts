import CategoryService, { Grupo, Marca, Modelo, Tipo } from "../services/CategoryService";
import { ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET, CAT, CAT_STATIC, CAT_TABLE_NAME, CAT_TABLE_NAMES } from "../constants";
import { Request, Response, NextFunction } from "express";
import { CreationAttributes, ModelAttributeColumnOptions } from "sequelize";
import RequestValidationError from "../errors/RequestValidationError";
import ResourceNotFoundError from "../errors/ResourceNotFoundError";

const ctrl = new CategoryService();

type CatMap = {
  [key in CAT_TABLE_NAME]: CAT_STATIC; 
};

const catMap: CatMap = {
  "Tipos": Tipo,
  "Grupos": Grupo,
  "Modelos": Modelo,
  "Marcas": Marca
};


export default {
  async create(req: Request, res: Response, next: NextFunction) {
    if (req.query.many) {
      return next();
    }

    const categoria = req.params.cat;

    const cat: CreationAttributes<Tipo> | undefined = req.body;
    try {
      if (!cat)
      throw new RequestValidationError("Missing Category in request body");

      if (categoria !== "Tipos" && categoria !== "Modelos" && categoria !== "Grupos" && categoria !== "Marcas")
      throw new RequestValidationError("Escolha uma das categoais válidas!");

      await ctrl.createCategoria(cat, catMap[categoria as CAT_TABLE_NAME]);
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        }
        default: {
          res.status(500);
          break;
        }
      }

      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      })
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você registrou ${ANSI_RESET}${ANSI_MAGENTA}1${ANSI_RESET}${ANSI_GREEN} categoria no banco de dados.${ANSI_RESET}`
    });
  },

  async createMany(req: Request, res: Response) {

  },

  /**
   * need docs
   * todo -> cat is confusing, must change to "type" or something, then, "name" must be "cat"
   * @param req.query.name is the unique;
   * @param req.query.cat is the cat;
   */
  async delete(req: Request, res: Response) {
    const categoria = req.params.cat;
    const name = req.params.name;

    let destroyedRows = 0;
    try {
      if (!CAT_TABLE_NAMES.includes(categoria))
        throw new ResourceNotFoundError("This category does not exists on database. " + `(${typeof name})`);

      const id = await ctrl.getCatId(name, catMap[categoria as CAT_TABLE_NAME]);

      if (!id)
        throw new ResourceNotFoundError("The category you're trying to delete does not exists on database. " + `(${name} - ${categoria})`);

      destroyedRows = await catMap[categoria as CAT_TABLE_NAME].destroy({ where: { id: id } });
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        }
        case ResourceNotFoundError: {
          res.status(404);
          break;
        }
        default: {
          res.status(500);
          break;
        }
      }

      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      })
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você removeu com sucesso a tupla indicada${ANSI_RESET}`
    });
  },

  async getCategorias(req: Request, res: Response) {
    const categoria = req.params.cat;

    let cats: CAT[] = [];
    try {
      if (!CAT_TABLE_NAMES.includes(categoria))
        throw new RequestValidationError("This category does not exists on database. " + `(${typeof categoria})`);

      cats = await ctrl.getCats(catMap[categoria as CAT_TABLE_NAME]);      
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break; 
        };
        default: {
          res.status(500);
          break;

        }
      }
      res.status(500).json({
        error: (err as any).toString(),
        message: `${ANSI_RED}Ocorreu um erro ao tentar retornar as categorias especificadas.${ANSI_RESET}`
      })
    }

    res.json({
      msg: `${ANSI_GREEN}Você requisitou as categorias da tabela ${ANSI_RESET}${ANSI_MAGENTA}${categoria}${ANSI_RESET}${ANSI_GREEN}`,
      payload: cats
    });
  },

  async getCategoriaColumns(req: Request, res: Response) {
    const categoria = req.params.cat;

    let columns = null;
    try {
      if (!CAT_TABLE_NAMES.includes(categoria))
      throw new RequestValidationError("This category does not exists on database: " + categoria);

      columns = catMap[categoria as CAT_TABLE_NAME].getAttributes();
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        }
        default: {
          res.status(500);
          break;
        }
      }
      return res.json({
        err: err,
        msg: ``
      })
    }
    res.json({
      msg: `${ANSI_GREEN}Você requisitou as colunas da tabela ${ANSI_RESET}${ANSI_MAGENTA}${categoria}${ANSI_RESET}${ANSI_GREEN}`,
      payload: Tipo.getAttributes()
    });
  },
}