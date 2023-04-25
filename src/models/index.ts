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
