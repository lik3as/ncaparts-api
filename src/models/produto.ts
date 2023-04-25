import {
    Table,
    Model,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey
} from 'sequelize-typescript'

@Table
class Produto extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    //@ForeignKey(() => )
    @Column
    id_prod: number;

    //@ForeignKey(() => )
    @Column
    id_tipo: number

    //@ForeignKey(() => )
    @Column
    id_marca: number

    //@ForeignKey(() => )
    @Column
    id_modelo: number

    @Column
    sku: string

    @Column
    desc: string

}