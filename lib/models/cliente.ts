import {Venda} from './index'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';


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
  senha: number;

  @Column
  revendedor: boolean;
};
