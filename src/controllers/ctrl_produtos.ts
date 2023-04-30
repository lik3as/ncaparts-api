import { Produto } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IControllers'


export default class ProdutoCtrl implements IFab<Produto>{

  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Produto[]> { 
    return (typeof args == undefined ) ?
     Produto.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Produto.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Produto> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Produto.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }
}

const fabri: ProdutoCtrl = new ProdutoCtrl()
