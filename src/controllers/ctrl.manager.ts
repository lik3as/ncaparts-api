import { Request, Response, NextFunction } from "express";
import { Database } from 'ncaparts-db';

const cats: string[] = ['Tipos', 'Marcas', 'Subtipos', 'Modelos', 'Versoes'];


const on_error = (err: any) => {
  console.log('An error occured while trying to access utils route: \n' + 
  `\x1b[31m${err}\x1b[0m`);
};

export default{
  async get_tables(req: Request, res: Response, next: NextFunction){
    return await Database.queryInterface.showAllTables();
  },

  async get_table_columns(req: Request, res: Response, next: NextFunction){
    const table: string = req.params.table;
    if (cats.includes(table)){
      return res.redirect(`/tables/Produtos/${table}/columns`);
    }
    return res.redirect(`/tables/${table}/columns`)
  },

  async post_table(req: Request, res: Response, next: NextFunction) {
    const table: string= req.params.table;
    req.url = '/tables/' + table ;

    if (cats.includes(table)) {
      req.url = '/tables/Produtos/' + table;
    }

    return next();
  },  

  async get_table(req: Request, res: Response, next: NextFunction){
    const table: string = req.params.table 

    req.url = `/tables/${table}`;

    if(cats.includes(table)){
      req.url = `/tables/Produtos/${table}`;
    }

    return next();
  },

  async redirect(req: Request, res: Response, next: NextFunction){
    return res.redirect('/tables' + req.url);
  }
}