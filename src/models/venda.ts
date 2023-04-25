import Cliente from './cliente'
import {
    Table,
    Model,
    Column,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    DataType
} from 'sequelize-typescript'

@Table
class Venda extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
 
    @Column
    id_merc: number;

    @ForeignKey(() => Cliente)
    @Column
    id_cli: number;

    @Column
    qtd: number;

    @Column(DataType.DECIMAL({precision: 10, scale: 2}))
    valor_total: number;

}

export default Venda;