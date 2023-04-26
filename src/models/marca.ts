import {Produto} from './index';
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany
} from 'sequelize-typescript'

@Table
export class Marca extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nome: string

  @HasMany(() => Produto)
  produtos: Produto[]
}