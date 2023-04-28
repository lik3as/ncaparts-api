import { FindOptions, IncludeOptions, Includeable, ModelOptions } from "sequelize";
import { Literal } from "sequelize/types/utils";


declare type ScopesOptions = join | ((...args: any[]) => join);
export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};

export declare function Scopes(scopesGetter: ScopesOptionsGetter): Function;

export type rel_prod = 'prod' | 'merc';
export type rel_prodFab = 'fab' | 'prod';
export type rel_prod_categories = 'tipo' | 'subtipo' | 'marca' | 'modelo';
export type rel_fab = 'prod';
export type rel_merc = 'prod' | 'kit';
export type rel_logi = ['merc', any]
export type rel_kit = 'prod'
export type rel_cliente = ['venda', any]

export type methods = 'join_in';

//The specific type for the inner join scope
export type join = IncludeOptions | undefined | Includeable[] | Includeable | ModelOptions<any> 
| FindOptions | Literal

