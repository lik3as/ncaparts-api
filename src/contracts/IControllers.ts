import param_bodies from './args/IBodiesArgs'
import param_body from './args/IBodyArgs'

/**
 * @type {generic_body} - This type is a generic type that can serve as any class
 * attributes
 */
export type body<T> = Promise<T | null>
export default interface Ctrl<T>{

  /**
  *   @returns lista de registros da tabela de acordo com o método;
  *   @param method - Nome do método a ser utilizado:
  *   @param method_on - Onde será usado o método
  *   @param args - Argumento do método
  */
  getBodies({method, on, args}: param_bodies): body<T[]>;
  getBody({method='find_by_', on, args}: param_body): body<T>;
}

export { param_bodies, param_body };
