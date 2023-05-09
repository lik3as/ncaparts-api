import {
  Model,
  Column,
  ForeignKey,
  HasMany,
  Table,
  PrimaryKey,
  AutoIncrement,
  Unique,
} from 'sequelize-typescript'
import { Produto } from './produto'


@Table
export class Versao extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number
  
  @HasMany(() => Produto)
  produtos: Produto[]

  @Unique
  @Column
  nome: string
}
