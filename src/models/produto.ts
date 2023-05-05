import { prod_scopes } from '../scopes/scopes'

import {
  Marca,
  Modelo,
  Tipo,
  Subtipo,
  Fabricante,
  ProdFab,
  ProdKit,
  Kit,
  Mercadoria,
  Versao
} from './index'

import {
  HasMany,
  BelongsToMany,
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasOne,
  BelongsTo,
  Scopes
} from 'sequelize-typescript'

/*
    * Os primeiros três conjuntos de associação servem para
    * classificar o produto como no seguinte exemplo:
    * Eletrônico -> Tipo
    * Subtitipo -> Celular
    * Samsung -> Marca
    * S10 -> Modelo
*/

@Scopes(prod_scopes)

/*
*   Categories are:
*   tipo, subtipo, marca and modelo
*/

@Table
export class Produto extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  /*
  *   Product Auto-Association
  */
  @ForeignKey(() => Produto)
  @Column
  id_prod: number;

  @BelongsTo(() => Produto)
  produto: Produto

  /*
  *   OneToMany Product Spec Associations
  */

  @ForeignKey(() => Tipo)
  @Column
  id_tipo: number;

  @ForeignKey(() => Subtipo)
  @Column
  id_subtipo: number;
  
  @ForeignKey(() => Marca)
  @Column
  id_marca: number;

  @ForeignKey(() => Modelo)
  @Column
  id_modelo: number;

  @ForeignKey(() => Versao)
  @Column
  id_versao: number;

  /*
  *   OneToMany Other Associations
  */

  @HasMany(() => Mercadoria)
  mercadorias: Mercadoria[];

  @Column
  sku: string;

  @Column
  final: boolean;

  @Column
  desc: string;
  
  /*
  *   Many To Many Associations
  */

  @BelongsToMany(() => Fabricante, () => ProdFab, 'id_prod', 'id_fab')
  fabricantes: Fabricante[];

  @BelongsToMany(() => Kit, () => ProdKit, 'id_prod', 'id_kit')
  kits: Kit[];

}
