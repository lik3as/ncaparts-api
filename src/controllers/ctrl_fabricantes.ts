import { Fabricante, body_fab, scope_fab } from "../models/index";

type body = Promise<body_fab[] | undefined>

export default class FabricanteCtrl{
  private _all: body;
  private _in_products: body

  constructor(){ }

  get all(): body{
    this._all = Fabricante.findAll();
    return this._all;
  }

  public getProductsIn(scope: scope_fab): body{
    this._in_products = Fabricante.scope(scope).findAll()
    return this._in_products;
  }

}