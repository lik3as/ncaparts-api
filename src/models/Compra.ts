import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo
} from 'sequelize-typescript'
import Usuario from './Usuario'
import { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

@Table
export default class Compra extends Model<InferAttributes<Compra>, InferCreationAttributes<Compra>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @Column
  declare qtd: number;

  @Column
  declare id_merc: number;

  @Column(DataType.DECIMAL({precision: 10, scale: 2}))
  declare valor_total: number;

  @ForeignKey(() => Usuario)
  @Column
  declare id_usr: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;
}