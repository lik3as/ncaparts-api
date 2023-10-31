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

    let fabricantes: Fabricante.attributes<"default">[] = [];
    try {
      fabricantes = await Mdl.findAll({limit: +query.limit, offset: +query.offset});
    } catch (e) {
      res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao retornar os fabricantes. ${ANSI_RESET}`
      })
    }
    res.json(fabricantes);

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

    } catch(e) {
      return res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao criar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      });
    }

    res.json({
      msg: `${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}${ANSI_GREEN}
      Haviam ${ANSI_BLUE}${fabricantes.length}${ANSI_RESET}${ANSI_GREEN} mercadorias no objeto${ANSI_RESET}`
    });


  },

  async delete_instance(req: Request, res: Response) {
    const query = req.query;

    let destroyedRows = 0;
    try {
      if (typeof query.nome !== 'string') 
      throw new Error("O nome fornecido não foi uma string. " + `(${query.nome})`);

      const id = await ctrl.getIdByUnique(query.nome);

      if (!id)
      throw new Error("Não existe um fabricante registrado com esse nome");

      destroyedRows = await Mdl.destroy({where: {id: id}});
    } catch (e) { 
      return res.status(500).json({
        error: e,
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      });
      
    }
    res.json({
      msg: `${ANSI_GREEN}Você removeu com sucesso ${ANSI_RESET}${ANSI_MAGENTA}${destroyedRows}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`
    });
  },

  async updateMany(req: Request, res: Response, next: NextFunction) {

  }
}
