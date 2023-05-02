import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  Scopes
} from 'sequelize-typescript'
import {Produto} from './index';


@Table
export class Modelo extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nome: string

  @HasMany(() => Produto)
  produtos: Produto[]

}