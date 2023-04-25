import Venda from './venda'
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DefaultScope,
    AutoIncrement
} from 'sequelize-typescript';

@DefaultScope(() => ({
    include: {
        model: Venda
    }
}))

@Table
export default class Cliente extends Model{
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
