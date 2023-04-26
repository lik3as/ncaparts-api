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

export type body_logi = {
  id: number,
  rastreio: string,
  vol_liq: number,
  vol_brt: number,
  c_real: number,
  c_dolar: number
}
export type scope_logi = 'join_in_merc'

@Scopes(() => ({
  join_in_merc: {
    include: [{
      model: Mercadoria,
      required: true
    }]
  }
}))

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