import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import fabScopes from '../scopes/fabScopes'

import {
  Produto
} from './index'

import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  Scopes,
  Unique,
  HasMany,
  DataType
} from 'sequelize-typescript'

@Scopes(fabScopes)

@Table
export default class Fabricante extends Model<InferAttributes<Fabricante>, InferCreationAttributes<Fabricante>> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;
  
  @Unique(true)
  @Column
  declare cnpj: string;

  @Unique(true)
  @Column
  declare nome: string;

  @Column
  declare contato: string;

  @Column
  declare local: string;

  @Column
  declare email: string;
  
  @HasMany(() => Produto)
  produtos: Produto[]
}
