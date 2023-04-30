import ICtrl, {param, body} from  '../contracts/IControllers'
import { Venda } from '../models/index'

export default class VendaCtrl implements ICtrl<Venda>{

  getBodies({method, model_fab}: param): body<Venda[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, model_fab}: param): body<Venda>{
    throw new Error('Uninplemented error');
  }

}
