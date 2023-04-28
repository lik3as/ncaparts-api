import { Fabricante } from "../models/index";
import IFab, {param, generic_body} from '../contracts/IControllers'


export default class FabricanteCtrl implements IFab<Fabricante>{

  constructor(){ }

  public async getBodies({method, model_fab}: param) : generic_body<Fabricante[]> { 
    return (typeof model_fab[1] == undefined ) ?
     Fabricante.scope(
      {method: `${method}${model_fab[0]}`}
      ).findAll()
      :
      Fabricante.scope(
      {method: [`${method}${model_fab[0]}`, model_fab[1]]}
      ).findAll()
  }

  public async getBody({method, model_fab}: param): generic_body<Fabricante> {
    if (method!='find_by_id')
      throw new Error("Este método retorna uma lista.");
    return Fabricante.scope(
      {method: [`${method}${model_fab[0]}`, model_fab[1]]}
      ).findOne()
  }
}

const fabri: FabricanteCtrl = new FabricanteCtrl()