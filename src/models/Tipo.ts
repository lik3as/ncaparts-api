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
import Produto from './Produto';
import { ProdTipo } from './associative';
import { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

@Table
export default class Tipo extends Model<InferAttributes<Tipo>, InferCreationAttributes<Tipo>>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Unique(true)
  @Column
  declare nome: string;

  /** Must implement ON DELETE SET NULL somewhere */
  @BelongsToMany(() => Produto, () => ProdTipo, "fk_tipo", "fk_produto")
  produtos: CreationOptional<Produto>[]
}
