import {Cliente, body_cliente} from '../models/index'

type body = Promise<body_cliente[] | undefined>
class ClienteCtrl{
  private _all: body;

  constructor(){ }

  get all(): body{
    this._all = Cliente.findAll();
    return this.all;
  }


}