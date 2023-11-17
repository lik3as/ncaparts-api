import { Sequelize } from 'sequelize-typescript';
import env from '../config/config';

import Usuario from './Usuario';
import Compra from './Compra';
import Fabricante from './Fabricante';
import Kit from './Kit';
import Marca from './Marca';
import Mercadoria from './Mercadoria';
import Modelo from './Modelo';
import Produto from './Produto';
import Tipo from './Tipo';
import Grupo from './Grupo';

import {
  ProdGrupo,
  ProdKit,
  ProdMarca,
  ProdModel,
  ProdTipo,
} from './associative';
import { ANSI_MAGENTA, ANSI_RESET } from '../constants';

const envMode = (env.env === 'production') ? env.production : env.development;

const sequelize = new Sequelize(envMode.database, envMode.username, envMode.password, {
  host: envMode.host,
  dialect: envMode.dialect,
  port: envMode.port as number,
  logging: sql => {
    console.log(`SQL: \x1b[32m ${sql} \x1b[0m`)
  }
});

sequelize.addModels([
  Marca,
  Modelo,
  Tipo,
  Grupo,
  Usuario,
  Compra,
  Kit,
  Fabricante,
  Mercadoria,
  Produto,
  ProdKit,
  ProdTipo,
  ProdGrupo,
  ProdMarca,
  ProdModel
]);

sequelize.authenticate().then(() => {
  console.log(`\n${ANSI_MAGENTA}database connection stabilished${ANSI_RESET}`)
}).catch(err => {
  console.log(err)
});

export default class Database {
  public static async delaySync({ after, alter = false, force = false }: sync_param) {
    for (let i: number = after; i > 0; i--) {
      console.log('Synchronizing in ' + i);
      await new Promise(res => setTimeout(res, 1000));
    }
    sequelize.sync({
      force: force,
      alter: alter,
      logging: process.argv.includes("-v") ? sql => {
        console.log(`SQL \x1b[35mSYNC\x1b[0m: \x1b[33m ${sql} \x1b[0m`)
      } : undefined
    });
  }

  static get queryInterface() {
    return sequelize.getQueryInterface();
  }
  
  static get sequelize() {
    return sequelize;
  }
}

export {
  Usuario,
  Compra,
  Fabricante,
  Kit,
  Marca,
  Mercadoria,
  Modelo,
  Produto,
  Tipo,
  Grupo,
}

interface sync_param {
  after: number,
  alter?: boolean,
  force?: boolean
}