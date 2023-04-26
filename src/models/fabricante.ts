import { where } from 'sequelize';
import {
  ProdFab,
  Produto
} from './index'
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  DefaultScope,
  Scopes
} from 'sequelize-typescript'

export type body_fab = {
  id: number
  nome: string,
  cnpj: string,
  contato: string,
  local:string,
  email:string,
}

export type scope_fab = 'join_in_prod';

@Scopes(() => (
  {
  join_in_prod: {
    include: [{
        model: Produto,
        required: true
      }
    ],
  }
}))

@Table
export class Fabricante extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column 
  id: number;
  
  @Column
  cnpj: string;

  @Column
  nome: string;

  @Column
  contato: string;

  @Column
  local: string;

  @Column
  email: string;
  
  @BelongsToMany(() => Produto, () => ProdFab)
  produtos: Produto[]
}