import {
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  Column,
  AutoIncrement,
} from "sequelize-typescript";

import { Grupo, Kit, Marca, Modelo, Produto, Tipo,  } from '../';

@Table
export class ProdGrupo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Produto)
  @Column
  declare fk_produto: number;

  @ForeignKey(() => Grupo)
  declare fk_grupo: number;

}


@Table
export class ProdKit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  declare id: number;

  @Column
  declare qtd_prod: number;

  @ForeignKey(() => Produto)
  @Column
  declare fk_produto: number

  @ForeignKey(() => Kit)
  @Column
  declare fk_kit: number
};


@Table
export class ProdMarca extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Produto)
  @Column
  declare fk_produto: number;

  @ForeignKey(() => Marca)
  @Column
  declare fk_marca: number;

};


@Table
export class ProdModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Produto)
  @Column
  declare fk_produto: number;

  @ForeignKey(() => Modelo)
  @Column
  declare fk_modelo: number;

};

@Table
export class ProdTipo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Produto)
  @Column
  declare fk_produto: number;

  @ForeignKey(() => Tipo)
  @Column
  declare fk_tipo: number;
};

