import {Venda} from './index'
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
