import {
    PrimaryKey,
    ForeignKey,
    Column,
    Model,
    Table,
    AutoIncrement,
    DataType
} from 'sequelize-typescript'
import Produto from './produto';
import Kit from './kit';

@Table
export default class Mercadoria extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Column
    @ForeignKey(() => Produto)
    id_prod: number

    @Column
    @ForeignKey(() => Kit)
    id_kit: number 

    @Column
    sku: string

    @Column
    importado: boolean

    @Column(DataType.DECIMAL({precision: 10, scale: 2}))
    v_real: number

    @Column(DataType.DECIMAL({precision: 10, scale: 2}))
    v_dolar: number

    @Column(DataType.DECIMAL({precision: 10, scale: 2}))
    v_real_revenda: number



}