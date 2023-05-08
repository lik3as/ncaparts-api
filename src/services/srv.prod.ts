import { Produto } from "../models/index";
import sequelize from '../models/index'
import IFab, {param_body, param_bodies, body} from '../contracts/IServices'


export default class ProdutoCtrl implements IFab<Produto>{
  constructor(){ }

  public async getBodies({method, on, args}: param_bodies) : body<Produto[]> { 
    return (typeof args == undefined ) ?
     Produto.scope(
      {method: `${method}${on}`}
      ).findAll()
      :
      Produto.scope(
      {method: [`${method}${on}`, args]}
      ).findAll()
  }

  public async getBody({ method, on, args }: param_body): body<Produto> {
    if (method!='find_by_')
      throw new Error("Este método retorna uma lista.");
    return Produto.scope(
      {method: [`${method}${on}`, args]}
      ).findOne()
  }

  public async getAllBodies(): Promise<Produto[]>{
    return await Produto.findAll(
      {
        order: [
          sequelize.fn('concat', sequelize.col('id_tipo'), sequelize.col('id_subtipo'), sequelize.col('id_marca'), sequelize.col('id_modelo'), sequelize.col('id_versao')) 
        ]
      }
    )
  }
}

const fabri: ProdutoCtrl = new ProdutoCtrl()
