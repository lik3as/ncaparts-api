import ICtrl, {param, body} from  '../contracts/IControllers'
import { Mercadoria } from '../models/index'

export default class MercCtrl implements ICtrl<Mercadoria>{

  getBodies({method, model_fab}: param): body<Mercadoria[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, model_fab}: param): body<Mercadoria>{
    throw new Error('Uninplemented error');
  }

}
