import ICtrl, {param_body, param_bodies, body} from '../contracts/IControllers';
import {Cliente} from '../models/index'

export default class ClienteCtrl implements ICtrl<ClienteCtrl>{

  getBodies({method, on, args}: param_bodies): body<ClienteCtrl[]>{
    throw new Error('Uninplemented');
  }
  getBody({method, on, args}: param_body): body<ClienteCtrl>{
    throw new Error('Uninplemented');
  }

}
