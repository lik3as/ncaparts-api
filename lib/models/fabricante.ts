import { fab_scopes} from '../scopes/scopes'

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
  Scopes
} from 'sequelize-typescript'


@Scopes(fab_scopes)

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