import UserService, { Usuario } from "../services/UserService";
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Request, Response, NextFunction } from "express";
import { Attributes, CreationAttributes } from "sequelize";
import RequestValidationError from "../errors/RequestValidationError";

const usrService = new UserService();

export default {
  async all(req: Request, res: Response) {
    try {
      res.status(200).json(await usrService.getAllBodies())
    } catch (e) {
      res.status(500).json({
        error: e,
        msg: `${ANSI_GREEN}Houve um erro ao retornar todos os usuários.`
      })
    }
  },

  /**
   * @param req.query
   * 
   * object_type -> the body object type. It must be the User.*body* or User.*attrs* type.
   */
  async create_many(req: Request, res: Response, next: NextFunction) {
    const users: CreationAttributes<Usuario>[] | undefined = req.body;
    let created: Attributes<Usuario>[] = [];

    try {
      if (!users)
      throw new RequestValidationError("No user found in request body.")

      created = await Usuario.bulkCreate(users);
    } catch (err) {
      switch (err) {
        case (err instanceof RequestValidationError): {
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
    res.status(201).json({
      msg: `${ANSI_GREEN}Um total de ${ANSI_RESET}${ANSI_MAGENTA}${created}${ANSI_RESET} ${ANSI_GREEN}clientes foram inseridos no banco` +
      '\n\x1b[32mHavia(m) \x1b[0m\x1b[35m' + users.length + '\x1b[0m\x1b[32m registro(s) no objeto.\x1b[0m'
    });
  },

  /**
   * @param req.query
   * 
   * many -> bulk create or not, stands for "many". Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the User.*body* or User.*attrs* type.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const query = req.query;

    if (query.many) {
      return next();
    }

    const user: CreationAttributes<Usuario> | undefined = req.body;
    let created: Attributes<Usuario> | null = null
    try {
      if (!user)
      throw new RequestValidationError("Missing user in request body.");

      created = await Usuario.create(user);
    } catch (err) {
      switch (err) {
        case (err instanceof RequestValidationError): {
          res.status(400);
          break;
        };
        default: {
          res.status(500);
          break;
        };
      }
      return res.status(201).json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      });
    }

    res.status(200).json({
      id: created.id,
      msg: `\x1b[32mUsuario inserido com sucesso \x1b[0m`
    })
  },

  async delete_instance(req: Request, res: Response) {
    const query = req.query;

    let destroyedRows = 0;
    try {
      if (typeof query.email !== "string")
        throw new RequestValidationError("O email fornecido não foi uma string. " + `(${query.email})`);

      const id = await usrService.getIdByUnique(query.email);

      if (!id)
        throw new RequestValidationError("Não há nenhum registro de usuário com o email " + query.email);

      destroyedRows = await Usuario.destroy({ where: { id: id } });
    } catch (err) {
      switch (err) {
        case (err instanceof RequestValidationError): {
          res.status(400);
          break;
        };
        default: {
          res.status(500);
          break;
        }
      };

      return res.json({
        error: (err as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      })
    }

    res.status(200).json({
      affectedRows: destroyedRows,
      msg: `${ANSI_GREEN}Você removeu com sucesso ${ANSI_RESET}${ANSI_MAGENTA}${destroyedRows}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`
    });
  },

  async get_columns(req: Request, res: Response) {
    return res.json(Usuario.getAttributes())
  }

}