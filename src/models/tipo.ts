import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript'

class Tipo extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    nome: string
}