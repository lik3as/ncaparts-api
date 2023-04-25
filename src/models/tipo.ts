import {
    Model,
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany
} from 'sequelize-typescript'
import Produto from './produto';

@Table
export default class Tipo extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    nome: string;

    @HasMany(()=> Produto)
    produtos: Produto[];
}