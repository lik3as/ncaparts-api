import { ProdKit, Produto } from './index';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  Scopes
} from 'sequelize-typescript'

export type body_kit = {
  id: number,
  apelido: string,
}
export type scope_kit = 'join_in_prod'


@Scopes(() => ({
  join_in_prod: {
    include: [{
      model: ProdKit,
      required: true
    }]
  }
}))

@Table
export class Kit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;
  
  @Column
  apelido: string;

  @BelongsToMany(() => Produto, () => ProdKit)
  produtos: Produto[];
}