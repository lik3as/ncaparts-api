import { Compra } from "../models/index";
import Controller from "./Controller";

export { Compra };
export default class CompraCtrl extends Controller<Compra> {
  constructor(){
    super(Compra);
  }

  static get skeleton() {
    return Compra;
  }
}

