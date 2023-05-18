import { sequelize } from "ncaparts-db";
import { Request, Response, NextFunction } from "express";


const cats: string[] = ['Tipos', 'Marcas', 'Subtipos', 'Modelos', 'Versoes']


const on_error = (err: any) => {
  console.log('An error occured while trying to access utils route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default{
  async get_tables(req: Request, res: Response, next: NextFunction){
    const tables: string[] = await sequelize.getQueryInterface().showAllTables();
    return res.json(tables);
  },

  async get_table(req: Request, res: Response, next: NextFunction){
    const table: string = req.params.table 
    
    if(cats.includes(table)){
      return res.redirect(`/tables/Produtos/${table}`);
    }
    return res.redirect(`/tables/${table}`);
  },
}