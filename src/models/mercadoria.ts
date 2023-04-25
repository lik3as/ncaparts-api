import {
    PrimaryKey,
    ForeignKey,
    Column,
    Model,
    Table,
    AutoIncrement,
    DataType
} from 'sequelize-typescript'

@Table
class Mercadoria extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @Column
    //@ForeignKey(() => )
    id_prod: number

    @Column
    //@ForeignKey(() => )
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