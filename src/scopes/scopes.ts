export {Scopes} from './scope-types'


/*
*   Dentro dos scopes será aplicada até uma subquery por
*   scope. Caso seja necessário fazer uma pesquisa com mais
*   de um subquery, apenas utilize os finders.
*/
export {default as scope_prod} from './scope_prod'
export {default as scope_fab} from './scope_fab'