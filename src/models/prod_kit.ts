import { Kit, Produto } from './index';
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Scopes
} from 'sequelize-typescript'


@Table
export class ProdKit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  qtd_prod: number;

  @ForeignKey(() => Produto)
  @Column
  id_prod: number

  @ForeignKey(() => Kit)
  @Column
  id_kit: number
};