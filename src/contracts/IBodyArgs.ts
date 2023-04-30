import {
  method_specific_key,
  method_general,
} from "../scopes/scope-types";

export default interface MethodArgs{
  method: method_general;
  on: method_specific_key;
  args: string | number
}
