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
} from 'sequelize-typescript'

@Table
export class Fabricante extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column 
  id: number;
  
  /*
      Product Auto-Association
  */
  @ForeignKey(() => Produto)
  @Column
  id_prod: number;

  @BelongsTo(() => Produto)
  produto: Produto

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
