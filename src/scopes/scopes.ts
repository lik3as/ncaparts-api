export {Scopes} from './scope-types'

//The type of the functions names
export type prod = ['join_in_prod' | 'join_in_tipo' | 'join_in_subtipo' | 'join_in_marca'
| 'join_in_modelo' | 'join_in_merc' | 'join_in_categories', boolean | string]
export type prodKit = ['join_in_prod' | 'join_in_kit', any];
export type prodFab = ['join_in_fab' | 'join_in_prod', any]
export type modelo = ['join_in_prod', any]
export type fab = ['join_in_prod', number];
export type merc = ['join_in_prod' | 'join_in_kit', any];
export type marca = ['join_in_prod', any];
export type logi = ['join_in_merc', any]
export type kit = 'join_in_prod'
export type cliente = ['join_in_venda', any]

/*
*   Dentro dos scopes será aplicada até uma subquery por
*   scope. Caso seja necessário fazer uma pesquisa com mais
*   de um subquery, apenas utilize os finders.
*/
export {default as scope_prod} from './scope_prod'
export {default as scope_fab} from './scope_fab'