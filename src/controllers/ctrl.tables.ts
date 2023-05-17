import { sequelize } from "ncaparts-db";
import { Request, Response, NextFunction } from "express";


const on_error = (err: any) => {
  console.log('An error occured while trying to access utils route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default{

  async get_tables(req: Request, res: Response, next: NextFunction){
    const tables: string[] = await sequelize.getQueryInterface().showAllTables();
    return res.json(tables);
  },

  async predicate(req: Request, res: Response, next: NextFunction){
    if (req.query.table != undefined) return next('router');
    console.log('predicate')
    next();
  }
}