import { sProd } from 'ncaparts-ctrl'
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
      next('route')
    }

    res.json({'placeholder': 'placeholder'})
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    await ctrl.createCategoria(req.get('categoria'), req.body).catch(on_error)
    
    res.json({'placeholder': 'placeholder'})
  },

  async get_categorias(req: Request, res: Response) {
    return res.json(await ctrl.getCategorias('Tipo').catch(on_error));

  }
}