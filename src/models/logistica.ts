import {
  Model,
  Table,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  DataType,
  HasOne,
  Scopes
} from 'sequelize-typescript'
import { Mercadoria } from './mercadoria';


@Table
export class Logistica extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @HasOne(() => Mercadoria)
  mercadoria: Mercadoria

  @Column
  rastreio: string

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  vol_liq: number

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  vol_brt: number

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  c_real: number

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  c_dolar: number

}