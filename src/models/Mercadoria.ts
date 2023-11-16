import { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKeyConstraintError } from 'sequelize';
import mercScopes from '../scopes/mercScopes';
import {
  Produto,
  Kit,
} from './index'

import {
  PrimaryKey,
  ForeignKey,
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  BelongsTo,
  Unique,
  Scopes,
  AllowNull,
} from 'sequelize-typescript'

@Scopes(mercScopes)

@Table({ tableName: 'Mercadorias' })
export default class Mercadoria extends Model<InferAttributes<Mercadoria>, InferCreationAttributes<Mercadoria>>{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Unique(true)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => Produto,)
  declare fk_produto: CreationOptional<number>;

  @BelongsTo(() => Produto, { onDelete: "CASCADE" })
  produto: CreationOptional<Produto>;

  @ForeignKey(() => Kit)
  @Column(DataType.INTEGER)
  declare fk_kit: CreationOptional<number>;

  @BelongsTo(() => Kit)
  kit: CreationOptional<Kit>

  @Column(DataType.ARRAY(DataType.STRING))
  declare skus_relacionados: string[];

  @Column
  declare importada: boolean;

  @Column
  declare disponivel: boolean;

  @Column(DataType.DECIMAL({ precision: 10, scale: 2 }))
  declare valor_real: number;

  @Column(DataType.DECIMAL({ precision: 10, scale: 2 }))
  declare valor_real_revenda: number;

}