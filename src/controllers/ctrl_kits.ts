import Ctrl, { body, param_body, param_bodies } from "../contracts/IControllers";
import { Kit } from "../models";

export default class KitCtrl implements Ctrl<Kit>{
  getBodies({ method, on, args }: param_bodies): body<Kit[]> {
    throw new Error("Method not implemented.");
  }
  getBody({ method, on, args }: param_body): body<Kit> {
    throw new Error("Method not implemented.");
  }

}
