import { sProd } from 'ncaparts-db'
import { Request, Response, NextFunction } from "express";

const ctrl = new sProd();

const on_error = (err: any) => {
  console.log('An error occured while trying to access Products route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default {

  /**
   * @returns Fifty latest products ordered by name 
   */
  async latest(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies().catch(on_error))
  },

  async create(req: Request, res: Response, next: NextFunction) {
    if (req.get('categoria') != undefined) {
      return next('route')
    }

    return res.json(await ctrl.createMany(req.body));
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    const data = await ctrl.createCategoria(req.params.cat, req.body).catch(on_error)

    if (Array.isArray(data)){
      return res.send(`\x1b[32mVocê registrou um total de \x1b[0m\x1b[35m${data.length} \x1b[32mno banco de dados\x1b[0m` +
      '\nHaviam ' + req.body.length + ' de categorias no arquivo.');
    }

    return res.send(`Você registrou ${data} no banco de dados.`);

  },

  async get_categorias(req: Request, res: Response) {
    return res.json(await ctrl.getCategorias(req.params.cat).catch(on_error));
  },

  async get_cat_columns(req: Request, res: Response) {
    return res.json(sProd.tipoSkeleton.getAttributes());
  },

  async get_columns(req: Request, res: Response) {
    return res.json(sProd.skeleton.getAttributes())
  }
}