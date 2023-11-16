import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Scopes,
  Unique,
  HasMany,
  DataType,
} from 'sequelize-typescript';

import Compra from './Compra';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import usrScopes from '../scopes/userScopes';

@Scopes(usrScopes)
@Table
export default class Usuario extends Model<InferAttributes<Usuario>, InferCreationAttributes<Usuario>>{
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column
  declare nome: string;
  
  @Column
  declare contato: string;
  
  @Unique(true)
  @Column
  declare email: string;

  @Column
  declare senha: string;

  @Column
  declare revendedor: boolean;

  @HasMany(() => Compra)
  compras: CreationOptional<Compra[]>;
};
