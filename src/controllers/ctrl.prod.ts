import ProdutoCtrl from "../services/srv.prod";
import { Request, Response } from "express";

  const ctrl = new ProdutoCtrl();

export default {

  /**
   * @returns Fifty latest products ordered by name 
   */
  async latest(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies());
  },

  create(req: Request, res: Response) {
    
  }
}