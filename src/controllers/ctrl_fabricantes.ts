import { Fabricante } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IControllers'


export default class FabricanteCtrl implements IFab<Fabricante>{

  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Fabricante[]> { 
    return (typeof args == undefined ) ?
     await Fabricante.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      await Fabricante.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Fabricante> {
    console.log(method + on + `(${args})`)
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return await Fabricante.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}
