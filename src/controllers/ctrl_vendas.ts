import { Venda } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IControllers'


export default class VendaCtrl implements IFab<Venda>{

  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Venda[]> { 
    return (typeof args == undefined ) ?
     Venda.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Venda.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Venda> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Venda.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: VendaCtrl = new VendaCtrl()
