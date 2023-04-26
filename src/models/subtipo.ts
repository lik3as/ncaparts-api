import {Produto} from './index'
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  HasMany
} from 'sequelize-typescript'

@Table
export class Subtipo extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @HasMany(() => Produto)
  produtos: Produto[]

  @Column
  nome: string;

}
