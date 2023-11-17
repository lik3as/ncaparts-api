import ProductService, { Produto } from "../services/ProductService";

import { CreationAttributes } from "sequelize"

import { ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET, QUERY_LIMIT } from "../constants";
import { Request, Response, NextFunction } from "express";
import RequestValidationError from '../errors/RequestValidationError';

const prodService = new ProductService();

export default {

  async getSome(req: Request, res: Response, next: NextFunction) {
    if (req.query.UUID) return next();

    try {
      if (!req.query.limit || +req.query.limit < 0) 
      throw new RequestValidationError("Limit cannot be a negative number.");

      if (+req.query.limit > QUERY_LIMIT) 
      throw new RequestValidationError("Limit cannot be greater than " + QUERY_LIMIT);

      const offset: number  = +(req.query.offset || 0);
      const limit: number = +(req.query.limit || 0);

      res.status(200).json(await prodService.getSome(limit, offset));
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
      res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RESET}Houve um erro ao retornar os produtos.${ANSI_RESET}`
      });
    }
  },

  async count(req: Request, res: Response, next: NextFunction) {
    const count = await prodService.records();
    return res.json(count);
  },

  async getOne(req: Request, res: Response) {
    const UUID: string = req.params.UUID as string;

    const produto = await prodService.findByUnique(UUID);

    try {
      if (!produto)
        throw new RequestValidationError("Este RID não corresponde a nenhum produto: " + UUID);

    } catch (err) {
      switch ((err as Object).constructor) {
        case RequestValidationError: {
          res.status(400);
          break
        }
        default: {
          res.status(500);
          break;
        }
      }
      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao consultar o produto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      });
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}O foi encontrado com sucesso${ANSI_RESET}`,
      payload: produto
    });
  },

  async create_many(req: Request, res: Response, next: NextFunction) {
    const produtos: CreationAttributes<Produto>[] | undefined = req.body;

    let created: Produto[] = [];

    try {
      if (!produtos || produtos.length == 0) {
        throw new RequestValidationError();
      }

      created = await ProductService.createAndAssociate(produtos);
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
        msg: `${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      });
    }

    res.status(201).json({
      msg: `${ANSI_GREEN}Você registrou um total de ${ANSI_RESET}${ANSI_MAGENTA}${created.length} ${ANSI_GREEN}produtos no banco de dados${ANSI_RESET}` +
        `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${produtos.length} ${ANSI_RESET}${ANSI_GREEN} de produtos no arquivo.${ANSI_RESET}.
    `});
  },

  /**
   * need docs
   * @param req.params.UUID is the unique;
   */
  async delete_produto(req: Request, res: Response) {
    const UUID = req.params.UUID;

    let produto: Produto | null = null
    try {
      produto = await prodService.findByUnique(UUID);

      if (!produto)
        throw new RequestValidationError("Este produto não existe no banco de dados. " + `(Resrouce ID: ${UUID})`);

      await produto.destroy();

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
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      })
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você removeu com sucesso o produto ${ANSI_RESET}${ANSI_MAGENTA}${produto.SKU}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`
    });
  },


  async get_columns(req: Request, res: Response) {
    return res.json(Produto.getAttributes())
  },

  async updateFields(req: Request, res: Response) {

  },

  /**
   * Replacing all products of the database means TRUNCATING the Products table
   * 
   * When called, all old references (UUIDs) to the products are lost
   */
  async replaceAll(req: Request, res: Response) {
    const produtos: CreationAttributes<Produto>[] | undefined = req.body;

    let created: Produto[] = [];
    try {
      if (!produtos || produtos.length == 0)
        throw new RequestValidationError();

      await Produto.truncate({ cascade: true });
      created = await ProductService.createAndAssociate(produtos)
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
        msg: `${ANSI_RED}Um erro ocorreu ao substituir todos os produtos, contate o administrador do sistema se necessário.${ANSI_RESET}`
      });
    }
    const count = await Produto.count();
    res.status(201).json({
      msg: `${ANSI_GREEN}Você substituiu com sucesso ${count} produtos por ${created.length} produtos${ANSI_RESET}`
    })

  },

  /**
   * When replacing a single product, the resource id (UUID) will not change
   * 
   * So you can change the SKU of the product without losing its UUID reference. (The product will be the same)
   */
  async createOrReplace(req: Request, res: Response) {
    const UUID = req.params.UUID;
    const product: CreationAttributes<Produto> | undefined = req.body;

    let upserted: Produto | null = null;
    try {
      if (!product)
      throw new RequestValidationError("Missing product in body.");

      const alreadyExists = await prodService.findByUnique(UUID);
      if (alreadyExists) {
        upserted = await alreadyExists.update(product);
      } else {
        upserted = (await ProductService.createAndAssociate(product))[0];
      }

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
        message: `${ANSI_RED}Houve um erro ao colocar o recurso na URI indicada.${ANSI_RESET}`
      });
    }
    res.status(201).json({
      msg: `${ANSI_GREEN}Você criou com sucesso um novo recurso na URI /produtos/${UUID}`,
      UUID: upserted.get("UUID")
    })
  }

};
