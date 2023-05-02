import {Scopes, scope_fab} from '../scopes/scopes'

import {
  ProdFab,
  Produto
} from './index'

import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
} from 'sequelize-typescript'


@Scopes(scope_fab)

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
  
  @BelongsToMany(() => Produto, () => ProdFab, 'id_fab', 'id_prod')
  produtos: Produto[]
}