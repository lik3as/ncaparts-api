import Ctrl, { body } from "../contracts/IControllers";
import MethodArgs from "../contracts/MethodArgs";
import { Kit } from "../models";

export default class KitCtrl implements Ctrl<Kit>{
  getBodies({ method, model_fab }: MethodArgs): body<Kit[]> {
    throw new Error("Method not implemented.");
  }
  getBody({ method, model_fab }: MethodArgs): body<Kit> {
    throw new Error("Method not implemented.");
  }

}
