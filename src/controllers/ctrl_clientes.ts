import { Cliente } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IControllers'


export default class ClienteCtrl implements IFab<Cliente>{

  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Cliente[]> { 
    return (typeof args == undefined ) ?
     Cliente.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Cliente.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Cliente> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Cliente.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: ClienteCtrl = new ClienteCtrl()
