import { Kit } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IServices'


export default class KitCtrl implements IFab<Kit>{
  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Kit[]> { 
    return (typeof args == undefined ) ?
     Kit.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Kit.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Kit> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Kit.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: KitCtrl = new KitCtrl()
