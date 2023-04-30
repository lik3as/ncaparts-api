import ICtrl, {param_body, param_bodies, body} from  '../contracts/IControllers'
import { Venda } from '../models/index'

export default class VendaCtrl implements ICtrl<Venda>{

  getBodies({method, on, args}: param_bodies): body<Venda[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, on, args}: param_body): body<Venda>{
    throw new Error('Uninplemented error');
  }

}
