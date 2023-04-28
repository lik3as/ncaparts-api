import Ctrl, { generic_body } from "../contracts/IControllers";
import MethodArgs from "../contracts/MethodArgs";
import { Kit } from "../models";

class KitCtrl implements Ctrl<Kit>{
  getBodies({ method, model_fab }: MethodArgs): generic_body<Kit[]> {
    throw new Error("Method not implemented.");
  }
  getBody({ method, model_fab }: MethodArgs): generic_body<Kit> {
    throw new Error("Method not implemented.");
  }

}