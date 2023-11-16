type joinParams = 'prod' | 'fab' | 'tipo' | 'grupo' |
'marca' | 'modelo' | 'merc' | 'cats';

type findParams = "unique" | "related" | "limit";
 
export interface args {
  args: string | number | string[] | number[];
} 

export type utilScopes = "includeProd";

export interface joinParam {
  method: "join";
  param: joinParams;
}

export interface findParam {
  method: "find";
  param: findParams;
}

export type methodParam = (findParam | joinParam) & args;