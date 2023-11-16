import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { ProdGrupo } from './associative';
import { Produto } from './index'
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
export default class Grupo extends Model<InferAttributes<Grupo>, InferCreationAttributes<Grupo>>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;
  
  @Unique(true)
  @Column
  declare nome: string;
 
  @BelongsToMany(() => Produto, () => ProdGrupo, "fk_grupo", "fk_produto")
  produtos: Produto[]
}
