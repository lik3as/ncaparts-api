import { Fabricante } from 'ncaparts-db';
import { Request, Response, NextFunction } from 'express';
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";

const Mdl = Fabricante.Mdl;
const ctrl = new Fabricante.Ctrl();

export default {
  /**
   * @param req.query
   * limit -> limit of models to be included in the list
   * 
   * offset -> offset of the query
   */
  async getModels(req: Request, res: Response) {
    const query = req.query;
    if (query.limit !== 'string') query.limit = '10'
    if (query.offset !== 'string') query.offset = '0';

    try {
      const fabricantes = await Mdl.findAll({limit: +query.limit, offset: +query.offset});
      res.json(fabricantes);
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao retornar os fabricantes. Erro: ${ANSI_RESET}
      ${e}`)
    }

  },

  /**
   * @param req.query
   * u -> should update or not. Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the Fabricante.*body* or Fabricante.*attrs* type.
   */
  async createMany(req: Request, res: Response, next: NextFunction)  {
    const fabricantes: Fabricante.body<string[]>[] | Fabricante.attributes[] | undefined = req.body;
    const query = req.query;

    let created: Fabricante.attributes<"default">[] = []

    if (typeof query.u !== 'undefined') return next();
    try {
      if (!fabricantes) throw new Error("O corpo da requisição está vazio.");

      if (query.object_type === "body") {
        /**
         * using attributes type becuase the use of 'body' type in this case would have the same effect, except for the 
         * need of an loop for "converting" each type of each element.
         */
        const fabricantes: Fabricante.attributes[] = req.body;

        const filtered = await ctrl.filter(fabricantes);
        created = await Mdl.bulkCreate(filtered);
      } else if (query.object_type === "attrs") {
        const fabricantes: Fabricante.attributes[] = req.body;

        const filtered = await ctrl.filter(fabricantes)
        created = await Mdl.bulkCreate(filtered);
      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.")
      }

      res.send(`${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}${ANSI_GREEN}
      Haviam ${ANSI_BLUE}${fabricantes.length}${ANSI_RESET}${ANSI_GREEN} mercadorias no objeto${ANSI_RESET}`);

    } catch(e) {
      res.send(`${ANSI_RED}Houve um erro ao criar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }


  },

  async updateMany(req: Request, res: Response, next: NextFunction) {

  }
}