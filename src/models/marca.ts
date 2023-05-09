import {Produto} from './index';
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  Unique
} from 'sequelize-typescript'

@Table
export class Marca extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @Column
  nome: string

  @HasMany(() => Produto)
  produtos: Produto[]
}