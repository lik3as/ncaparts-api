import { FindOptions, IncludeOptions, Includeable, ModelOptions } from "sequelize";
import { Literal } from "sequelize/types/utils";


declare type ScopesOptions = join | ((...args: any[]) => join);
export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};


export declare function Scopes(scopesGetter: ScopesOptionsGetter): Function;

//The type of the functions names
export type prod = ['join_in_prod' | 'join_in_tipo' | 'join_in_subtipo' | 'join_in_marca'
| 'join_in_modelo' | 'join_in_merc' | 'join_in_categories', boolean | string]
export type prodKit = ['join_in_prod' | 'join_in_kit', any];
export type prodFab = ['join_in_fab' | 'join_in_prod', any]
export type modelo = ['join_in_prod', any]
export type fab = ['join_in_prod', any];
export type merc = ['join_in_prod' | 'join_in_kit', any];
export type marca = ['join_in_prod', any];
export type logi = ['join_in_merc', any]
export type kit = 'join_in_prod'
export type cliente = ['join_in_venda', any]

//The specific type for the inner join scope
export type join = IncludeOptions | undefined | Includeable[] | Includeable | ModelOptions<any> 
| FindOptions | Literal

