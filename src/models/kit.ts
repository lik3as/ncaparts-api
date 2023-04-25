import {
    Table,
    Model,
    Column,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript'

@Table
class Kit extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;
    
    @Column
    apelido: string;
}