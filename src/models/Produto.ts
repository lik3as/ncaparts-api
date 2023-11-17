/**
 * The Produto model is agregated with Mercadoria's currency data, like price and resale price;
 * It's used to separate the tables as a "Filter" table, wich has the Product itself data like
 * product description, product SKU and so on;
 */

/**
 * Currenty (>= 7ad4b99d199109676e55d8080115568b7f044b44), this Table is trying (or already implementing)
 * a filter architecture that allows a Product to have two group (subcategories or subtypes);
 * 
 * NOTE: Certainly there are better implementations than this one ¯\_(ツ)_/¯
 */
import {
  Marca,
  Modelo,
  Tipo,
  Grupo,
  Fabricante,
  Mercadoria,
} from './index'

import {
  BelongsToMany,
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Scopes,
  DataType,
  Unique,
  AllowNull,
  HasOne,
  DefaultScope,
  Default,
} from 'sequelize-typescript'

import { ProdGrupo, ProdMarca, ProdModel, ProdTipo } from './associative';
import { CreationOptional, InferAttributes, InferCreationAttributes, CreationAttributes } from 'sequelize';
import prodScopes from '../scopes/prodScopes'

@Scopes(prodScopes)
@DefaultScope(() => ({
  include: [{
    association: "tipos",
    required: true,
  }, {
    association: "grupos",
    required: true,
  }, {
    association: "marcas",
    required: true,
  }, {
    association: "modelos",
    required: true,
  }, {
    association: "mercadoria",
    required: true,
  }]
}))

@Table
export default class Produto extends Model<InferAttributes<Produto>, InferCreationAttributes<Produto>>{
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare UUID: CreationOptional<string>;

  @Column(DataType.ARRAY(DataType.STRING(1024)))
  declare imagens: string[];

  @Column
  declare nome: string;

  /*
  *   Product Auto-Association
  */
  @BelongsTo(() => Produto)
  produto: CreationOptional<Produto>;

  @ForeignKey(() => Produto)
  @Column(DataType.INTEGER)
  declare fk_produto: CreationOptional<number>;

  @Unique(true)
  @AllowNull(false)
  @Column
  declare SKU: string;

  @Column
  declare final: boolean;

  @Column(DataType.STRING)
  declare desc: string;

  @BelongsTo(() => Fabricante)
  fabricante: CreationOptional<Fabricante>;

  @ForeignKey(() => Fabricante)
  @AllowNull(false)
  @Column
  declare fk_fabricante: number;
  
  @HasOne(() => Mercadoria, "fk_produto")
  mercadoria: Mercadoria;

  /**
   * ManyToMany Cats Associations
   */

  /*
   * Tipo
   */
  @BelongsToMany(() => Tipo, () => ProdTipo, 'fk_produto', 'fk_tipo')
  tipos: CreationOptional<Tipo[]>;

  /**
   * Grupo
   */
  @BelongsToMany(() => Grupo, () => ProdGrupo, 'fk_produto', 'fk_grupo')
  grupos: CreationOptional<Grupo[]>;

  /**
   * Marca
   */
  @BelongsToMany(() => Marca, () => ProdMarca, 'fk_produto', 'fk_marca')
  marcas: CreationOptional<Marca[]>;

  /**
   * Modelo
   */
  @BelongsToMany(() => Modelo, () => ProdModel, 'fk_produto', 'fk_modelo')
  modelos: CreationOptional<Modelo[]>;
}
