import {Produto} from './index'
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  HasMany,
  Unique
} from 'sequelize-typescript'

@Table
export class Subtipo extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @HasMany(() => Produto)
  produtos: Produto[]

  @Unique
  @Column
  nome: string;

}
