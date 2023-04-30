import ICtrl, {param_body, param_bodies, body} from  '../contracts/IControllers'
import { Produto } from '../models/index'

export default class ProdCtrl implements ICtrl<Produto>{

  getBodies({method, on, args }: param_bodies): body<Produto[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, on, args}: param_body): body<Produto>{
    throw new Error('Uninplemented error');
  }

}
