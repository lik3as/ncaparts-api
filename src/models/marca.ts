import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript'

class Marca extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    nome: string
}