import { Kit, Marca, Modelo, Produto, Grupo, Tipo, Mercadoria } from "../models";
import { ScopesOptionsGetter, includeProd, includeCatsProps } from "./utilScopes";
import { FindOptions, IncludeOptions, Op, literal } from "sequelize";

const mercScopes: ScopesOptionsGetter = () => ({
  find_unique(produto: string): FindOptions<Mercadoria> | IncludeOptions & FindOptions<Mercadoria> {
    return {
      attributes: {exclude: ['createdAt, updatedAt']},
      include: [{
        model: Produto,
        where: {
          UUID: produto,
        },
        ...includeCatsProps
      }]

    }
  },
  join_prod(sku: string): FindOptions & IncludeOptions {
    return {
      attributes: ['id', 'valor_real', 'valor_real_revenda', 'skus_relacionados', 'importada', 'disponivel'],
      include: [{
        model: Produto,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: {
          sku: {
            [Op.like]: sku
          },
        },
        include: [{
          model: Produto,
        }, ...includeCatsProps
        ]
      }],
    }
  },
  find_related(sku: string): FindOptions & IncludeOptions {
    return {
      attributes: [
       'DISTINCT "Mercadorias"."id"', 'valor_real', 'valor_real_revenda', 'skus_relacionados', 'importada', 'disponivel'
      ],
      where: literal(`'${sku}' = ANY(skus_relacionados)`),
      include: [
        { model: Kit, },
        { model: Produto },
        {
          model: Produto,
          required: true,
          include: [
            { model: Tipo },
            { model: Grupo },
            { model: Marca },
            { model: Modelo }
          ]
        }]
      ,
    }
  },
  join_tipo(fk_tipo: number): FindOptions & IncludeOptions{
    return {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Produto,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        required: true,
        include: [{
          model: Tipo,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          where: {
            id: { [Op.eq]: fk_tipo }
          }
        }],
      }]
    }
  },
  join_grupo(fk_grupo: number): FindOptions & IncludeOptions{
    return {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Produto,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
          model: Grupo,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          where: {
            id: { [Op.eq]: fk_grupo }
          }
        }],
      }]
    }
  },
  join_marca(fk_marca: number): FindOptions & IncludeOptions {
    return {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Produto,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
          model: Marca,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          where: {
            id: { [Op.eq]: fk_marca }
          }
        }],
      }]
    }
  },
  join_modelo(fk_modelo: number): FindOptions & IncludeOptions{
    return {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Produto,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: [{
          model: Modelo,
          attributes: {exclude: ['createdAt', 'updatedAt']},
          where: {
            id: { [Op.eq]: fk_modelo }
          }
        }],
      }]
    }
  },
  join_cats(nome_tipo: string, nome_subtipo: string,
    nome_marca: string, nome_modelo: string): FindOptions & IncludeOptions {
    return {
      attributes: {exclude: ['createdAt', 'updatedAt']},
      include: [{
        model: Tipo,
        where: {
          id: {
            [Op.eq]: literal(
              `SELECT id FROM Tipo ` +
              `WHERE nome = ${nome_tipo};`
            )
          }
        }
      }, {
        model: Grupo,
        where: {
          id: {
            [Op.eq]: literal(
              `SELECT id FROM Grupo ` +
              `WHERE nome = ${nome_subtipo};`
            )
          }
        }
      }, {
        model: Marca,
        where: {
          id: {
            [Op.eq]: literal(
              `SELECT id FROM Marca ` +
              `WHERE nome = ${nome_marca};`
            )
          }
        }
      }, {
        model: Modelo,
        where: {
          id: {
            [Op.eq]: literal(
              `SELECT id FROM Modelo ` +
              `WHERE nome = ${nome_modelo};`
            )
          }
        }
      }]
    }
  },
  limit([limit, offset]: [number, number]): FindOptions {
    return {
      limit: limit,
      offset: offset
    }
  },
  includeProduct(): IncludeOptions {
    return includeProd;
  }
})

export default mercScopes;