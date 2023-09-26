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
    return res.json(await ctrl.getAllBodies().catch(on_error))
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

    try {
      let created: Usuario.attributes<"default">[] = [];
      if (query.object_type === "body") {
        const users: Usuario.body[] = req.body;
        const filtered = await ctrl.filter(users);
      
        created = await Usuario.Mdl.bulkCreate(filtered);
      } else if (query.object_type === "body") {
        const users: Usuario.attributes<"creation">[] = req.body;
        const filtered = await ctrl.filter(users);
      
        created = await Usuario.Mdl.bulkCreate(filtered);

      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");

      }
      res.send(`\x1b[32mUm total de \x1b[0m\x1b[35m${created}\x1b[0m \x1b[32mclientes foram inseridos no banco\x1b[0m` + 
      '\n\x1b[32mHavia(m) \x1b[0m\x1b[35m' + users.length + '\x1b[0m\x1b[32m registro(s) no objeto.\x1b[0m');
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  /**
   * @param req.query
   * 
   * object_type -> the body object type. It must be the User.*body* or User.*attrs* type.
   */
  async create(req: Request, res: Response): Promise<void> {
    const query = req.query;
    const user: Usuario.attributes | Usuario.body = req.body;

    try {
      let created: Usuario.attributes<"default"> | null = null
      if (query.object_type === "body") {
        const user: Usuario.body = req.body;

        const filtered = await ctrl.filter(user);
        if (filtered === null) {
          throw new Error ("Este usuario já foi registrado: " + user.email);
        }
        
        created = await Usuario.Mdl.create(filtered);

      } else if (query.object_type === "attrs") {
        const user: Usuario.attributes = req.body;

        const filtered = await ctrl.filter(user);
        if (filtered === null) {
          throw new Error ("Este usuario já foi registrado: " + user.email);
        }
        
        created = await Usuario.Mdl.create(filtered);

      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }
      res.send(`\x1b[32mUsuario inserido: \x1b[0m\n${created.email}`)
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
      
    }
  },

  async get_columns(req: Request, res: Response) {
    return res.json(Usuario.Mdl.getAttributes())
  }

}