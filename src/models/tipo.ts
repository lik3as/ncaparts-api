import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  Unique
} from 'sequelize-typescript'
import {Produto} from './produto';

@Table
export class Tipo extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @HasMany(()=> Produto)
  produtos: Produto[];

  @Unique
  @Column
  nome: string;
}
