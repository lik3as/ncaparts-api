import { FindOptions, IncludeOptions, Includeable, ModelOptions } from "sequelize";
import { Literal } from "sequelize/types/utils";


declare type ScopesOptions = prod_join | ((...args: any[]) => prod_join);
export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};


export declare function Scopes(scopesGetter: ScopesOptionsGetter): Function;

//The type of the function name
export type prod = ['join_in_prod' | 'join_in_tipo' | 'join_in_subtipo' | 'join_in_marca'
| 'join_in_modelo' | 'join_in_merc' | 'join_in_categories', any?]

//The specific type for the inner join scope
export type prod_join = IncludeOptions | undefined | Includeable[] | Includeable | ModelOptions<any> 
| FindOptions | Literal
