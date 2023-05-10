import sequelize, { Produto, Tipo, Subtipo, Marca, Modelo, Versao } from "../models/index";
import IFab, {param_body, param_bodies, body} from '../contracts/IServices'
type categorias = Tipo[] | Subtipo[] | Marca[] | Modelo[] | Versao[]

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

  public async createCategoria(categoria: string | undefined, body: {}): Promise<void>{
    switch(categoria){
      case('Tipo'):
        await Tipo.create(body);
        break;
      case('Subtipo'):
        await Subtipo.create(body);
        break;
      case('Marca'):
        await Marca.create(body);
        break;
      case('Modelo'):
        await Modelo.create(body);
        break;
      case('Versao'):
        await Versao.create(body);
        break;
      default: 
        await Tipo.create(body);
        break;
    }
  }

  public async getCategorias(categoria: string): Promise<categorias> {
    switch(categoria){
      case('Tipo'):
        return await Tipo.findAll();
      case('Subtipo'):
        return await Subtipo.findAll();
      case('Marca'):
        return await Marca.findAll();
      case('Modelo'):
        return await Modelo.findAll();
      case('Versao'):
        return await Versao.findAll();
      default:
        return await Tipo.findAll();
    }
  }
}