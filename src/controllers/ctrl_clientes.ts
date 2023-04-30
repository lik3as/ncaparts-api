import ICtrl, {param, body} from '../contracts/IControllers';
import {Cliente} from '../models/index'

export default class ClienteCtrl implements ICtrl<ClienteCtrl>{

  getBodies({method, model_fab}: param): body<ClienteCtrl[]>{
    throw new Error('Uninplemented');
  }
  getBody({method, model_fab}: param): body<ClienteCtrl>{
    throw new Error('Uninplemented');
  }

}
