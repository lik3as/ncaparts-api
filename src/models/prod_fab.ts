import {Produto} from './produto';
import {Fabricante} from './fabricante'
import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement
} from 'sequelize-typescript'

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
