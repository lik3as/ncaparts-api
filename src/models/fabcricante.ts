import {
    Table,
    Model,
    Column,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    DataType,
    BelongsTo
} from 'sequelize-typescript'
import Produto from './produto';

@Table
export default class Fabricante extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column 
    id: number;
    
    /*
        Product Auto-Association
    */
    @ForeignKey(() => Produto)
    @Column
    id_prod: number;

    @BelongsTo(() => Produto)
    produto: Produto

    @Column
    cnpj: string;

    @Column
    nome: string;

    @Column
    contato: string;

    @Column
    local: string;

    @Column
    email: string;
}