import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Unique,
  BelongsToMany,
  DataType
} from 'sequelize-typescript'

import { Produto } from './';
import { ProdModel } from './associative';
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';


@Table
export default class Modelo extends Model<InferAttributes<Modelo>, InferCreationAttributes<Modelo>>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Unique(true)
  @Column
  declare nome: string

  @BelongsToMany(() => Produto, () => ProdModel, "fk_modelo", "fk_produto")
  produtos: CreationOptional<Produto[]>;
}
