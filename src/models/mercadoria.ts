import {
  Produto,
  Kit,
  Logistica
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


  @HasMany(() => Logistica)
  logisticas: Logistica[];

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