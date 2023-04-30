import { Fabricante } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IControllers'


export default class FabricanteCtrl implements IFab<Fabricante>{

  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Fabricante[]> { 
    return (typeof args == undefined ) ?
     Fabricante.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Fabricante.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Fabricante> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Fabricante.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: FabricanteCtrl = new FabricanteCtrl()
