import {
  Model,
  Column,
  ForeignKey,
  HasMany,
  Table,
  PrimaryKey,
  AutoIncrement,
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

  @Column
  nome: string
}
