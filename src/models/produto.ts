import Marca from './marca'
import Modelo from './modelo'
import Tipo from './tipo'

import {
    Table,
    Model,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
    ForeignKey,
    HasOne
} from 'sequelize-typescript'

/*
    * Os primeiros três conjuntos de associação servem para
    * classificar o produto como no seguinte exemplo:
    * Eletrônico -> Tipo
    * Subtitipo -> Celular
    * Samsung -> Marca
    * S10 -> Modelo
*/

@Table
export default class Produto extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => Tipo)
    @Column
    id_tipo: number;

    @HasOne(() => Tipo)
    tipo: Tipo;

    //FALTA O SUBTIPO

    @ForeignKey(() => Marca)
    @Column
    id_marca: number;

    @HasOne(() => Marca)
    marca: Marca


    @ForeignKey(() => Modelo)
    @Column
    id_modelo: number;

    @HasOne(() => Modelo)
    modelo: Modelo;


    @Column
    sku: string;

    @Column
    final: boolean;

    @Column
    desc: string;

}