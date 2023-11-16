import { Model, ModelStatic } from 'sequelize';
import { findParam, joinParam, methodParam, args } from './params/'

export default interface RW<T extends Model>{
  /**
   *   @returns lista de registros da tabela de acordo com o método;
   *   @param method - Nome do método a ser utilizado:
   *   @param param - Parâmetro no qual o argumento será usado
   *   @param args - Argumento do método
   *   @param all - Find all models
   */
  useScope({method, param, args }: findParam & args): ModelStatic<T>;
  useScope({method, param, args }: joinParam & args): ModelStatic<T>;
  useScope({method, param, args}: methodParam): ModelStatic<T>;

  getAttr(name: string): Promise<{}[]>;
}