import { Attributes, CreationAttributes } from 'sequelize';

import { Request, Response, NextFunction } from 'express';
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import ManufacturerService, { Fabricante } from '../services/ManufacturerService';
import RequestValidationError from '../errors/RequestValidationError';

const manfacService = new ManufacturerService();

export default {
  /**
   * @param req.query
   * limit -> limit of models to be included in the list
   * 
   * offset -> offset of the query
   */
  async getSome(req: Request, res: Response) {
    const query = req.query;
    if (query.limit !== 'string') query.limit = '10'
    if (query.offset !== 'string') query.offset = '0';

    let fabricantes: Attributes<Fabricante>[] = [];
    try {
      fabricantes = await Fabricante.findAll({limit: +query.limit, offset: +query.offset});
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
        error: err,
        msg: `${ANSI_RED}Houve um erro ao retornar os fabricantes.${ANSI_RESET}`
      })
    }
    res.json({
      msg: `${ANSI_GREEN}Fabricantes retornados com sucesso.${ANSI_RESET}`,
      payload: fabricantes
    });
  },

  /**
   * @param req.query
   * u -> should update or not. Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the Fabricante.*body* or Fabricante.*attrs* type.
   */
  async createMany(req: Request, res: Response, next: NextFunction)  {
    const query = req.query;

    const fabricantes: CreationAttributes<Fabricante>[] | undefined = req.body;
    let created: Attributes<Fabricante>[] = []
    if (typeof query.u !== 'undefined') return next();
    try {
      if (!fabricantes)
      throw new RequestValidationError("No manufacturer was provided.");

      created = await Fabricante.bulkCreate(fabricantes);
    } catch(err) {
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
      return res.json({
        error: err,
        msg: `${ANSI_RED}Houve um erro ao criar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      });
    }

    res.json({
      msg: `${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}${ANSI_GREEN}
      Haviam ${ANSI_BLUE}${fabricantes.length}${ANSI_RESET}${ANSI_GREEN} mercadorias no objeto${ANSI_RESET}`
    });
  },

  async delete_instance(req: Request, res: Response) {
    const name = req.params.name;

    let destroyedRows = 0;
    try {
      const id = await manfacService.getIdByUnique(name);

      if (!id)
      throw new RequestValidationError("Não existe um fabricante registrado com esse nome");

      destroyedRows = await Fabricante.destroy({where: {id: id}});
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
        error: err,
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
