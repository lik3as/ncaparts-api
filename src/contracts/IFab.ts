import { rel_fab, method } from '../scopes/scope-types'
import { body_fab } from '../models/fabricante'
import param from './MethodArgs'

export default interface IFabricantes{

  /**
  *   @returns lista de registros da tabela de acordo com o método;
  *   @param method - Nome do método a ser utilizado:
  *   @param model_fab - Array contendo o nome do modelo e o argumento passado ao
  *   parâmetro do método
  */
  getFabs({method, model_fab}: param): bodies; 
}

export {rel_fab, method, param};
export type bodies = Promise<body_fab[] | null>
export type body = Promise<body_fab | undefined | null>