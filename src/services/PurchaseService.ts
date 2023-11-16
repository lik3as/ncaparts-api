import { Compra } from "../models/index";
import Service from "./Service";

export { Compra };
export default class PurchaseService extends Service<Compra> {
  constructor(){
    super(Compra);
  }

  static get skeleton() {
    return Compra;
  }
}