import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  HasMany
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

  @Column
  nome: string;
}
