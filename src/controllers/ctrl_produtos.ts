import ICtrl, {param, body} from  '../contracts/IControllers'
import { Produto } from '../models/index'

export default class ProdCtrl implements ICtrl<Produto>{

  getBodies({method, model_fab}: param): body<Produto[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, model_fab}: param): body<Produto>{
    throw new Error('Uninplemented error');
  }

}
