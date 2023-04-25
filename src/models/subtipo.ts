import Produto from './produto'
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
export default class Subtipo extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @HasMany(() => Produto)
  produtos: Produto[]

  @Column
  nome: string;

}
