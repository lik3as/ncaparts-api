import ICtrl, {param_body, param_bodies, body} from  '../contracts/IControllers'
import { Mercadoria } from '../models/index'

export default class MercCtrl implements ICtrl<Mercadoria>{

  getBodies({method, on, args }: param_bodies): body<Mercadoria[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, on, args }: param_body): body<Mercadoria>{
    throw new Error('Uninplemented error');
  }

}
