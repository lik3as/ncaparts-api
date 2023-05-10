import ClienteCtrl from "../services/srv.cli";
import { Request, Response } from "express";

const ctrl = new ClienteCtrl();

const on_error = (err: any) => {
  console.log('An error occurred while trying to access client route: \n' + 
  `\x1b[31m${err}[0m`)
}

export default {
  async all(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies().catch(on_error))
  },

  async create(req: Request, res: Response): Promise<void> {
    await ctrl.create(req.body).catch(on_error)

    res.json({'placeholder': 'placeholder'})
  }

}