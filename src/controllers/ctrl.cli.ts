import ClienteCtrl from "../services/srv.cli";
import { Request, Response } from "express";

const ctrl = new ClienteCtrl();

export default {
  async all(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies())
  },

  async create(req: Request, res: Response): Promise<void> {
    let success = true;
    await ctrl.create(req.body).catch((err) => {
      console.log('Erro!')
      success = false;
    })

    res.json({'successful': success})
  }

}