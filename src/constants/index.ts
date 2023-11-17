import { ModelStatic } from "sequelize";
import { Grupo, Marca, Modelo, Tipo } from "../models";

export const ANSI_RED = "\x1b[31m";
export const ANSI_GREEN = "\x1b[32m";
export const ANSI_BLUE = "\x1b[34m";
export const ANSI_MAGENTA = "\x1b[35m"
export const ANSI_RESET = "\x1b[0m";

export type CAT = Tipo | Marca | Modelo | Grupo;
export type CAT_STATIC = ModelStatic<Tipo | Marca | Modelo | Grupo>;
export type CAT_NAME = "Tipo" | "Grupo" | "Modelo" | "Marca";
export type CAT_TABLE_NAME = "Tipos" | "Grupos" | "Modelos" | "Marcas";
export const CAT_TABLE_NAMES = ["Tipos", "Grupos", "Modelos", "Marcas"]

export const QUERY_LIMIT=20;