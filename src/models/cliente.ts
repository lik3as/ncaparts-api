import {Venda} from './index'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

export type body_cliente = {
  id: number,
  nome: string,
  contato: string,
  email: string,
  revendedor: boolean

}

@Table
export class Cliente extends Model{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Column
  nome: string;
  
  @Column
  contato: string;
  
  @Column
  email: string;

  @Column
  revendedor: boolean;
};
