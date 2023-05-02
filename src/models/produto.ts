import {Scopes, scope_prod} from '../scopes/scopes'

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
} from 'sequelize-typescript'

/*
    * Os primeiros três conjuntos de associação servem para
    * classificar o produto como no seguinte exemplo:
    * Eletrônico -> Tipo
    * Subtitipo -> Celular
    * Samsung -> Marca
    * S10 -> Modelo
*/

@Scopes(scope_prod)

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


  @HasOne(() => Tipo)
  tipo: Tipo;


  @ForeignKey(() => Subtipo)
  @Column
  id_subtipo: number;
  
  @HasOne(() => Subtipo)
  subtipo: Subtipo


  @ForeignKey(() => Marca)
  @Column
  id_marca: number;

  @HasOne(() => Marca)
  marca: Marca;


  @ForeignKey(() => Modelo)
  @Column
  id_modelo: number;

  @HasOne(() => Modelo)
  modelo: Modelo;


  @ForeignKey(() => Versao)
  @Column
  id_versao: number;

  @HasOne(() => Versao)
  versao: Versao;
  /*
  *   OneToMany Other Associations
  */

  @ForeignKey(() => Mercadoria)
  @Column
  id_merc: number;

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
