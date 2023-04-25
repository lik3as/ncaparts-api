import {Sequelize} from 'sequelize-typescript';
import prod_db from '../config/config';

class Database{
    private connection: Sequelize;

    constructor() {
        this.connection = new Sequelize(prod_db as Object);
        this.connection.sync({force: true});
    }
}

const db: Database = new Database();

export default Database;

export * as Cliente from './cliente'
export * as Venda from './venda'
export * as Fabricante from './fabricante'
export * as Kit from './kit'
export * as Logistica from './logistica'
export * as Marca from './marca'
export * as Mercadoria from './mercadoria'
export * as Modelo from './modelo'
export * as ProdFab from './prod_fab'
export * as ProdKit from './prod_kit'
export * as Produto from './produto'
export * as Subtipo from './subtipo'
export * as Tipo from './tipo'
