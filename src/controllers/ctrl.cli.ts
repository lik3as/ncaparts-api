import { sCli, sProd, sequelize } from 'ncaparts-db' 
import { Request, Response, NextFunction } from "express";

const ctrl = new sCli();

const on_error = (err: any) => {
  console.log('An error occurred while trying to access client route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default {
  async all(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies().catch(on_error))
  },

  async create_many(req: Request, res: Response, next: NextFunction): Promise<void> {
    //m => how much
    if (req.query.m != 'many') {
      return next();
    }
    
    let bodies: Object[] = req.body

    /* If the req body have emails that already have been registered
    *  at the database, the method will remove them.
    */
    //This uses a bulky function, (O(n^2))
    if (req.query.b == 'bulk') bodies = await ctrl.filterUniques(req.body as Object[]) as Object[];
    let data = await ctrl.createMany(bodies).catch(on_error);
    data = (data == null) ? [] : data;
    const inserted: number = (data as Array<any>).length;

    res.send(`\x1b[32mUm total de \x1b[0m\x1b[35m${inserted}\x1b[0m \x1b[32mclientes foram inseridos no banco\x1b[0m` + 
    '\n\x1b[32mHavia(m) \x1b[0m\x1b[35m' + (req.body as []).length + '\x1b[0m\x1b[32m registro(s) no objeto.\x1b[0m');
  },

  async create_one(req: Request, res: Response): Promise<void> {
    const filter = await ctrl.filterUniques(req.body as Object);
     if (filter == null) {
      res.send(`\x1bEste cliente já foi registrado: ${(req.body)}`)
      return;
     }
    
    const data = await ctrl.createOne(filter);
    res.send(`\x1b[32mCliente inserido: \x1b[0m\n${data.get()}`)
  },

  async get_columns(req: Request, res: Response) {
    return res.json(sCli.skeleton.getAttributes())
  }

}