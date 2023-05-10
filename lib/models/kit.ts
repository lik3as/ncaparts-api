import { Mercadoria, ProdKit, Produto } from './index';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
  Scopes,
  HasMany
} from 'sequelize-typescript'

export type body_kit = {
  id: number,
  apelido: string,
}
export type scope_kit = 'join_in_prod'

@Table
export class Kit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;
  
  @Column
  apelido: string;

  @HasMany(() => Mercadoria)
  mercadorias: Mercadoria[];

  @BelongsToMany(() => Produto, () => ProdKit)
  produtos: Produto[];
}
