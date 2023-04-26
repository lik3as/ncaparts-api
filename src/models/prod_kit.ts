import { Kit, Produto } from './index';
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey
} from 'sequelize-typescript'

@Table
export class ProdKit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  qtd: number;

  @ForeignKey(() => Produto)
  @Column
  id_produto: number

  @ForeignKey(() => Kit)
  @Column
  id_kit: number
}