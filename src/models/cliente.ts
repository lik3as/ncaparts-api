import {Venda} from './index'
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DefaultScope,
  AutoIncrement,
  Scopes
} from 'sequelize-typescript';

export type body_cliente = {
  id: number,
  nome: string,
  contato: string,
  email: string,
  revendedor: boolean

}

type scope_cliente = 'join_in_venda'

@DefaultScope(() => ({
  include: {
    model: Venda
  }
}))

@Scopes(() => ({
  join_in_venda: {
    include: [{
      model: Venda,
      required: true
    }]
  }
}))


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
