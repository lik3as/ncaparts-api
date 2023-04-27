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

export type body_modelo = {
  id: number,
  nome: string
}
export type scope_modelo = 'join_in_prod'

}))

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