import {
  Produto,
  Kit
} from './index'

import {
  HasOne,
  PrimaryKey,
  ForeignKey,
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  HasMany,
  Scopes
} from 'sequelize-typescript'

export type body_merc = {
  id: number,
  id_prod: number,
  id_kit: number,
  sku: string,
  importado: boolean,
  v_real: number,
  v_real_revenda: number,
  v_dolar: number
}
export type scope_merc = 'join_in_prod' | 'join_in_kit';

@Scopes(() => ({
  join_in_prod: {
    include: [{
      model: Produto,
      required: true
    }]
  },
  join_in_kit: {
    include: [{
      model: Kit,
      required: true
    }]
  }
}))

@Table
export class Mercadoria extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Produto)
  id_prod: number;

  @Column
  @ForeignKey(() => Kit)
  id_kit: number;


  @HasOne(() => Produto)
  produto: Produto;

  @HasOne(() => Kit)
  kit: Kit;

  @Column
  sku: string;

  @Column
  importado: boolean;

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  v_real: number;

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  v_dolar: number;

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  v_real_revenda: number;



}