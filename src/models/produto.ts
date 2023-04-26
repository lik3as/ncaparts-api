import {
  Marca,
  Modelo,
  Tipo,
  Subtipo,
  Fabricante,
  ProdFab,
  ProdKit,
  Kit
} from './index'

import {
  BelongsToMany,
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  HasOne
} from 'sequelize-typescript'

/*
    * Os primeiros três conjuntos de associação servem para
    * classificar o produto como no seguinte exemplo:
    * Eletrônico -> Tipo
    * Subtitipo -> Celular
    * Samsung -> Marca
    * S10 -> Modelo
*/

@Table
export class Produto extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  /*
  *   OneToMany Associations
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


  @Column
  sku: string;

  @Column
  final: boolean;

  @Column
  desc: string;
  
  /*
  *   Many To Many Associations
  */

  @BelongsToMany(() => Fabricante, () => ProdFab)
  fabricantes: Fabricante[];

  @BelongsToMany(() => Kit, () => ProdKit)
  kits: Kit[];

}
