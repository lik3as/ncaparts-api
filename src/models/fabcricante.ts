import {
    Table,
    Model,
    Column,
    PrimaryKey,
    ForeignKey,
    AutoIncrement,
    DataType
} from 'sequelize-typescript'

@Table
class Fabricante extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column 
    id: number;
    
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