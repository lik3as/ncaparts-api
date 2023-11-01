import { Usuario } from 'ncaparts-db'
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Request, Response, NextFunction } from "express";

const ctrl = new Usuario.Ctrl();

const on_error = (err: any) => {
  console.log('An error occurred while trying to access client route: \n' +
    `\x1b[31m${err}\x1b[0m`)
}

export default {
  async all(req: Request, res: Response) {
    try {
      res.json(await ctrl.getAllBodies())
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
   * m -> bulk create or not, stands for "many". Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the User.*body* or User.*attrs* type.
   */
  async create_many(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = req.query;
    if (req.query.m != 'many') {
      return next();
    }

    let users: (Usuario.attributes<"creation"> | Usuario.body)[] = req.body
    let created: Usuario.attributes<"default">[] = [];

    try {
      if (query.object_type === "body") {
        const users: Usuario.body[] = req.body;
        const filtered = await ctrl.filter(users);

        created = await Usuario.Mdl.bulkCreate(filtered);
      } else if (query.object_type === "attrs") {
        const users: Usuario.attributes<"creation">[] = req.body;
        const filtered = await ctrl.filter(users);

        created = await Usuario.Mdl.bulkCreate(filtered);

      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }
    } catch (e) {
      res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      });
    }
    res.status(200).json({
      msg: `${ANSI_GREEN}Um total de ${ANSI_RESET}${ANSI_MAGENTA}${created}${ANSI_RESET} ${ANSI_GREEN}clientes foram inseridos no banco` +
      '\n\x1b[32mHavia(m) \x1b[0m\x1b[35m' + users.length + '\x1b[0m\x1b[32m registro(s) no objeto.\x1b[0m'
    });
  },

  /**
   * @param req.query
   * 
   * object_type -> the body object type. It must be the User.*body* or User.*attrs* type.
   */
  async create(req: Request, res: Response): Promise<void> {
    const query = req.query;

    let created: Usuario.attributes<"default"> | null = null
    try {
      if (query.object_type === "body") {
        const user: Usuario.body = req.body;

        const filtered = await ctrl.filter(user);
        if (filtered === null) {
          throw new Error("Este usuario já foi registrado: " + user.email);
        }

        created = await Usuario.Mdl.create(filtered);

      } else if (query.object_type === "attrs") {
        const user: Usuario.attributes = req.body;

        const filtered = await ctrl.filter(user);
        if (filtered === null) {
          throw new Error("Este usuario já foi registrado: " + user.email);
        }

        created = await Usuario.Mdl.create(filtered);

      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }
    } catch (e) {
      res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      });
    }

    res.status(200).json({
      msg: `\x1b[32mUsuario inserido: \x1b[0m\n${created!.email}`
    })
  },

  async delete_instance(req: Request, res: Response) {
    const query = req.query;

    let destroyedRows = 0;
    try {
      if (typeof query.email !== "string")
        throw new Error("O email fornecido não foi uma string. " + `(${query.email})`);

      const id = await ctrl.getIdByUnique(query.email);

      if (!id)
        throw new Error("Não há nenhum registro de usuário com o email " + `(${query.email})`);

      destroyedRows = await Usuario.Mdl.destroy({ where: { id: id } });
    } catch (e) {
      return res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda.${ANSI_RESET}`
      })
    }
    res.status(200).json({
      msg: `${ANSI_GREEN}Você removeu com sucesso ${ANSI_RESET}${ANSI_MAGENTA}${destroyedRows}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`
    });
  },

  async get_columns(req: Request, res: Response) {
    return res.json(Usuario.Mdl.getAttributes())
  }

}