import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript'

class Categora extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    nome: string
}