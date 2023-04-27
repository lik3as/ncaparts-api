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

export type body_prodKit = {
  id: number,
  qtd_prod: number,
  id_prod: number,
  id_kit: number
};
export type scope_prodKit = 'join_in_prod' | 'join_in_kit';

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