import ICtrl, {param, body} from  '../contracts/IControllers'
import { Logistica } from '../models/index'

export default class LogiCtrl implements ICtrl<Logistica> {
  
  getBodies({method, model_fab}: param): body<Logistica[]>{
    throw new Error('Uninplemented error');
  }
  getBody({method, model_fab}: param): body<Logistica>{
    throw new Error('Uninplemented error');
  }

}
