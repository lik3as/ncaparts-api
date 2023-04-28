import { FindOptions, IncludeOptions, Includeable, ModelOptions } from "sequelize";
import { Literal } from "sequelize/types/utils";


declare type ScopesOptions = join | ((...args: any[]) => join);
export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};

export declare function Scopes(scopesGetter: ScopesOptionsGetter): Function;


export type rel_prod = ['prod' | 'merc'];
export type rel_prodFab = ['fab' | 'prod'];
export type rel_prod_categories = ['tipo' | 'subtipo' | 'marca' | 'modelo', string | undefined];
export type rel_fab = ['prod', number | undefined];
export type rel_merc = 'prod' | 'kit';
export type rel_logi = 'merc'
export type rel_kit = 'prod'
export type rel_cliente = 'venda'

/**
 * @type {method} - É a primeira parte do nome do escopo a ser utilizado
 * @example - Por exemplo: 'join_in_' + 'prod' resulta no na funcão de escopo * join_in_prod(parâmetros), seus parâmetros são
 * exigidos na classe controller.
 * 
 */

export type method = 'join_in_' | 'find_by_id';

//The specific type for the inner join scope
export type join = IncludeOptions | undefined | Includeable[] | Includeable | ModelOptions<any> 
| FindOptions | Literal

