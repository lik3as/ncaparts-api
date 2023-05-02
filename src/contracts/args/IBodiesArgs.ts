import {
  method_specific,
  method_general
} from "../../scopes/scope-types";

export default interface MethodArgs{
  method: method_general;
  on: method_specific;
  args: any
}
