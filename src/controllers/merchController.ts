import MerchandiseService, { Mercadoria } from "../services/MerchandiseService";

import { Request, Response, NextFunction } from "express";
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Attributes, CreationAttributes, where } from "sequelize";
import RequestValidationError from "../errors/RequestValidationError";
import RequestAuthorizationError from "../errors/RequestAuthorizationError";
import ResourceNotFoundError from "../errors/ResourceNotFoundError";

const merchService = new MerchandiseService();

/**
 * All delete functions need to return a payload with the following structure:
 * {
 *  msg: string,
 *  affcted: number,
 * }
 */
export default {
  async getSome(req: Request, res: Response, next: NextFunction) {
    let merchs: Attributes<Mercadoria>[] = []
    try {
      if (req.query.limit !== 'string' || +req.query.limit < 1)
      throw new RequestValidationError("You must provide a valid limit number");
      
      const limit = +req.query.limit;
      const offset = +(req.query.offset || 0);
      
      merchs = await merchService.getSome(limit, offset);
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
        msg: `${ANSI_RED}Houve um erro ao buscar as mercadorias. ${ANSI_RESET}`
      });
    }

    res.json(merchs);
  },

  async getMerch(req: Request, res: Response, next: NextFunction) {
    const UUID = req.params.UUID;

    let merch: Attributes<Mercadoria> | null = null;
    try {
      merch = await merchService.findByUnique(UUID);
      if (!merch) {
        throw new ResourceNotFoundError("The provided UUID does not exist in the database.");
      }

    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        };
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
        msg: `${ANSI_RED}Houve um erro ao buscar a mercadoria desejada (${UUID}). ${ANSI_RESET}`
      });
    
    }
    res.json({
      msg: `${ANSI_GREEN}A mercadoria foi retornada com sucesso.${ANSI_RESET}`,
      payload: merch
    });
  },

  /**
   * @param req.query
   * 
   * m -> bulk create or not, stands for "many". Boolean by existence (undefined or not undefined);
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const query = req.query;

    if (query.m) {
      return next();
    }

    const mercadoria: CreationAttributes<Mercadoria> | undefined = req.body;
    let created: Attributes<Mercadoria> | null = null;
    try {
      if (!mercadoria) 
      throw new RequestValidationError("Empty body.");

      created = await Mercadoria.create(mercadoria); 
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
      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      });
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Mercadoria inserida.${ANSI_RESET}`,
      payload: created.produto.UUID
    });
  },

  async create_many(req: Request, res: Response, next: NextFunction) {
    const mercadorias: CreationAttributes<Mercadoria>[] | undefined = req.body; 

    let created: Attributes<Mercadoria>[] = [];
    try {
      if (!mercadorias || mercadorias.length == 0)
      throw new RequestValidationError("Invalid body.");

      created = await Mercadoria.bulkCreate(mercadorias);
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
      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao criar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      });
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}
      ${ANSI_GREEN}Haviam ${ANSI_BLUE}${mercadorias.length}${ANSI_RESET}${ANSI_GREEN}mercadorias no objeto${ANSI_RESET}`
  });
  },

  async createOrReplace(req: Request, res: Response, next: NextFunction) {
    const UUID = req.params.UUID;
    const merch: CreationAttributes<Mercadoria> | undefined= req.body;

    let affectedRows = 0;
    let created: Mercadoria | null = null;
    try {
      if (!merch)
      throw new RequestValidationError("Invalid Body");

      affectedRows = await Mercadoria.destroy({where: {produto: {UUID: UUID}}});
      created = await Mercadoria.create(merch);
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        };
        default: {
          res.status(500);
          break;
        };
      }
      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      });
    }
    
    res.status(200).json({
      msg: `${ANSI_GREEN}Você criou uma nova mercadoria no lugar de ${ANSI_MAGENTA}${UUID}${ANSI_RESET}`,
      affected: affectedRows
    });
  },

  async delete(req: Request, res: Response) {
    const UUID = req.params.UUID;

    let destroyedRows = 0;
    try {
      const id = await merchService.getIdByUnique(UUID);

      if (!id)
      throw new ResourceNotFoundError("This merchandise does not exists on database." + `(${UUID})`);

      destroyedRows = await Mercadoria.destroy({where: {id: id}});
    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break;
        };
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
        error: err,
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      })
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você removeu com sucesso o registro indicado`,
      affected: destroyedRows
    });
  },

  async get_columns(req: Request, res: Response) {
    return res.json(Mercadoria.getAttributes());
  },

  async count(req: Request, res: Response) {
    const count = await merchService.records();
    return res.json(count);
  },
}
