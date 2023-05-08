import { Mercadoria } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IServices'


export default class MercadoriaCtrl implements IFab<Mercadoria>{
  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Mercadoria[]> { 
    return (typeof args == undefined ) ?
     Mercadoria.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Mercadoria.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Mercadoria> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Mercadoria.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: MercadoriaCtrl = new MercadoriaCtrl()
