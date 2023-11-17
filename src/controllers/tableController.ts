import Database from "../models";
import { NextFunction, Response, Request } from "express";

export default {
  async get_tables(req: Request, res: Response, next: NextFunction){
    const tables: string[] = await Database.queryInterface.showAllTables();
    return res.json(tables);
  },
}