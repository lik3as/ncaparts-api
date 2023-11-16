import { FindOptions, IncludeOptions } from "sequelize";
import { Grupo, Kit, Marca, Modelo, Produto, Tipo } from "../models";


declare type ScopesOptions = FindOptions | ((...args: any[]) => FindOptions);

export declare type ScopesOptionsGetter = () => {
    [sopeName: string]: ScopesOptions;
};

export const includeCatsProps = [{
  model: Tipo,
  required: true
}, {
  model: Grupo,
  required: true
}, {
  model: Marca,
  required: true
}, {
  model: Modelo,
  required: true
}]

export const includeProd: IncludeOptions = {
  include: [{
    model: Produto,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    required: true,
    include: [...includeCatsProps,
      { model: Kit, },
      { model: Produto }
    ]
  }],
};