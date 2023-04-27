import {Produto} from './produto';
import {Fabricante} from './fabricante'
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  Scopes
} from 'sequelize-typescript'

export type body_prodFab = {
  id: number,
  id_prod: number,
  id_fab: number
}

@Table
export class ProdFab extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Produto)
  @Column
  id_prod: number;

  @ForeignKey(() => Fabricante)
  @Column
  id_fab: number;
}
