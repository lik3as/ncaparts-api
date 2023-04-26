import { ProdKit, Produto } from './index';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany
} from 'sequelize-typescript'

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