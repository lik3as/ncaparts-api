import {Sequelize} from 'sequelize-typescript';
import prod_db from '../config/config';
import { Cliente } from './cliente';
import { Venda } from './venda';
import { Fabricante } from './fabricante';
import { Kit } from './kit';
import { Logistica } from './logistica';
import { Marca } from './marca';
import { Mercadoria } from './mercadoria';
import { Modelo } from './modelo';
import { ProdFab } from './prod_fab';
import { ProdKit } from './prod_kit';
import { Produto } from './produto';
import { Subtipo } from './subtipo';
import { Versao } from './versao';
import { Tipo } from './tipo';


class Database{
  public sequelize: Sequelize;

  constructor() {
    this.connect();
    this.sequelize.authenticate().then(() => {
      console.log('Conectado com sucesso!')
    }).catch(err => {
      console.log(err)
    });
  }

  private connect(): void{
    try{
      this.sequelize = new Sequelize(prod_db.production.database, prod_db.production.username,  prod_db.production.password, {
        host: prod_db.production.host,
        dialect: prod_db.production.dialect,
        port: prod_db.production.port as number,
        logging: false
      });
    } catch (e){
      console.log(e);
    } 

  }

}

const db: Database = new Database();

db.sequelize.addModels([
  Cliente, Venda, Fabricante, Kit, Logistica, Marca, Mercadoria, Modelo,
  ProdFab, ProdKit, Produto, Subtipo, Versao, Tipo 
]);


db.sequelize.sync({force: false});
export default db.sequelize;

export {
  Cliente, Venda, Fabricante, Logistica, Marca, Mercadoria, Modelo,
  ProdFab, ProdKit, Produto, Subtipo, Versao, Tipo, Kit
}