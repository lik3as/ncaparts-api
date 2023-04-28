import {
  method,
  rel_fab,
  rel_cliente,
  rel_kit,
  rel_logi,
  rel_merc,
  rel_prod,
  rel_prodFab
} from "../scopes/scope-types";

export default interface MethodArgs{
  method: method;
  model_fab: rel_fab;
  model_cliente: rel_cliente;
  model_kit: rel_kit;
  model_logi: rel_logi;
  model_merc: rel_merc;
  model_prod: rel_prod;
  model_prodFab: rel_prodFab;
}