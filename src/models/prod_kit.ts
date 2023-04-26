import {
  Model,
  Table,
  Column,
  PrimaryKey,
  AutoIncrement
} from 'sequelize-typescript'

@Table
export class ProdKit extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  qtd: number;
}