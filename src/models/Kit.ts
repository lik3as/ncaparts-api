import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import kitScopes from '../scopes/kitScopes';
import { Mercadoria } from './index';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  Scopes,
  HasMany,
  Unique,
  DataType
} from 'sequelize-typescript'

@Scopes(kitScopes)
@Table
export default class Kit extends Model<InferAttributes<Kit>, InferCreationAttributes<Kit>>{
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;
  
  @Unique(true)
  @Column
  declare nome: string;

  @Column
  declare desc: string;

  @HasMany(() => Mercadoria)
  mercadorias: Mercadoria[];

}
