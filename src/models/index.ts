import {Sequelize} from 'sequelize-typescript';
import prod_db from '../config/config';

class Database{
  private connection: Sequelize;

  constructor() {
    this.connection.sync({force: true});
  }

  private connect(): void{
    try{ this.connection = new Sequelize(prod_db as Object);
    } catch (e){
      console.log(e)
    } finally{
      this.connection.close()
    }
  }
}

const db: Database = new Database();

export default db;

export {Cliente} from './cliente'
export {Venda} from './venda'
export {Fabricante} from './fabricante'
export {Kit} from './kit'
export {Logistica} from './logistica'
export {Marca} from './marca'
export {Mercadoria} from './mercadoria'
export {Modelo} from './modelo'
export {ProdFab} from './prod_fab'
export {ProdKit} from './prod_kit'
export {Produto} from './produto'
export {Subtipo} from './subtipo'
export {Tipo} from './tipo'
