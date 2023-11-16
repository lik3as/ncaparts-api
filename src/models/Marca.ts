import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { ProdMarca } from './associative';
import {Produto} from './index';
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

@Table
export default class Marca extends Model<InferAttributes<Marca>, InferCreationAttributes<Marca>>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Unique(true)
  @Column
  declare nome: string

  @BelongsToMany(() => Produto, () => ProdMarca, "fk_marca", "fk_produto")
  produtos: Produto[]
}
