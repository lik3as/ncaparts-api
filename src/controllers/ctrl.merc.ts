"use strict"
import { sKit, sMerc, sProd } from "ncaparts-db";
import {Request, Response, NextFunction} from "express";
import IMercadoria from "../types/IMercadoria";

const ctrl = new sMerc();
const ctrl_prod = new sProd();
const ctrl_kit = new sKit();

const skeleton = new sMerc.skeleton();

type Mercadoria = typeof skeleton

const on_error = (err: any) => {
  console.log('An error occured while trying to access merc route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default {
  async get_mercs(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0'
    if (typeof req.query.offset === 'undefined') req.query.offset = '0';

    const productType = req.query.type?.toString().toUpperCase() as string | undefined;

    if (productType) {
      const productTypeId = await ctrl_prod.getCatId("Tipo", productType);
      const products = await ctrl.getBodies({method: 'join_in_', on:  'tipo', args: productTypeId}).catch(on_error);

      if (products && products.length > 0) return res.json(products);
    }
    return res.json(await ctrl.getOffsetBodies(+req.query.offset || Number.POSITIVE_INFINITY, +req.query.page));
  },

  async get_mercs_with_sku(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.rel !== 'undefined') return next();
    const sku = req.query.s;
    return res.json(await ctrl.getBodies({method: 'join_in_', on: 'prod', args: sku}));
  },

  async get_sugestions(req: Request, res: Response, next: NextFunction) {
    const sku = req.query.s as string;

    const prodId = (await ctrl_prod.getId(sku))!;

    const merc = await ctrl.getBody({method: "find_by_", on: "unique", args: prodId})!;
    const tipoID = await ctrl_prod.getCatId("Tipo", merc?.produto.tipo.nome!);

    const queryRelated = await ctrl.getBodies({method: 'find_by_', on: 'related', args: sku});

    let related: typeof skeleton[] = queryRelated!;

    if (!queryRelated || queryRelated.length == 0) { //Nenhum elemento relacionado.
      const relatedByType = await ctrl.getBodies({method: 'join_in_', on: 'tipo',args: tipoID});
      related = (relatedByType) ?? await ctrl.getOffsetBodies(Number.POSITIVE_INFINITY, 0);
    }

    return res.json(related);
  },

  async create(req: Request, res: Response, next: NextFunction) {
    if (req.query.m == 'many') {
      return next();
    }

    const mercadoria: IMercadoria = req.body;
    const merc_body: Mercadoria = skeleton.get({plain: true});

    const prodId = (await ctrl_prod.getBody({
        method: 'find_by_',
        on: 'unique',
        args: mercadoria.produto
      }))?.id;
    
    let kitId: number | undefined;
    if  (mercadoria.kit != null){
      kitId = (await ctrl_kit.getBody({
          method: 'find_by_',
          on: 'unique',
          args: mercadoria.kit
        }))?.id;
    }


    if (typeof prodId === 'undefined')
    throw new Error('O SKU não referenciam produto algum.');

    if (mercadoria.valor_real_revenda == null)
    mercadoria.valor_real_revenda = 0;

    if (typeof kitId !== 'undefined')
    merc_body.id_kit = kitId;

    merc_body.id_produto = prodId;
    merc_body.importada = mercadoria.importada;
    merc_body.disponivel = mercadoria.disponivel;
    merc_body.valor_real = mercadoria.valor_real;
    merc_body.valor_real_revenda = mercadoria.valor_real_revenda;  
    
    if (typeof (mercadoria.skus_relacionados) !== 'undefined') {
      let skus_relacionados: string[] = [];
      (mercadoria.skus_relacionados as string).
        split(',').map((val) => {skus_relacionados.push(val.trim())});
      merc_body.skus_relacionados = skus_relacionados;
    }
    else merc_body.skus_relacionados= [];

    const body: {} = merc_body.get({plain: true});

    const filtered = await ctrl.filterUniques(body) as Object;
    if (filtered == null){
      return res.send("\x1b[31mEsta mercadoria já foi registrada\x1b[0m");
    }

    const data = await ctrl.createOne(filtered);
    return res.send('\x1b[32mMercadoria inserida: \x1b[0m' + data);
  },


  async create_many(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (query.a == "update") {
      return next();
    }

    const mercadorias: IMercadoria[] = req.body;
    let bodies: Mercadoria[] = [];
    
    await Promise.all(mercadorias.map(
      async (mercadoria) => {
        const body: Mercadoria = new sMerc.skeleton().get({plain: true})

        const prodId = (await ctrl_prod.getBody({
            method: 'find_by_',
            on: 'unique',
            args: mercadoria.produto
          }))?.id;
        
        let kitId: number | undefined;
        if  (mercadoria.kit != null){
          kitId = (await ctrl_kit.getBody({
              method: 'find_by_',
              on: 'unique',
              args: mercadoria.kit
            }))?.id;
        }


        if (typeof prodId === 'undefined')
        throw new Error('O SKU não referenciam produto algum.');

        if (mercadoria.valor_real_revenda == null)
        mercadoria.valor_real_revenda = 0;

        if (typeof kitId !== 'undefined')
        body.id_kit = kitId;

        body.id_produto = prodId;
        body.importada = mercadoria.importada;
        body.disponivel = mercadoria.disponivel;
        body.valor_real = mercadoria.valor_real;
        body.valor_real_revenda = mercadoria.valor_real_revenda;  

        if (typeof (mercadoria.skus_relacionados) !== 'undefined') 
        body.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else body.skus_relacionados= [];

        bodies.push(body);
    }));

    const filtered = await ctrl.filterUniques(bodies) as Object[]
    const created_check = await ctrl.createMany(filtered).catch(on_error);
    
    const created = created_check ?? [];

    return res.send('\x1b[32mUm total de \x1b[0m' + created.length + '\x1b[32m mercadorias foram adicionadas\x1b[0m')
  },

  async update(req: Request, res: Response, next: NextFunction) { 
    const mercadorias: IMercadoria[] = req.body;
    let bodies: Mercadoria[] = [];
    
    await Promise.all(mercadorias.map(
      async (mercadoria) => {
        const prodId = (await ctrl_prod.getId(mercadoria.produto))!;
        const body: Mercadoria = (await ctrl.getBody({method: 'find_by_', on: 'unique', args: prodId}))?.get({plain: true})!;
        
        if (mercadoria.valor_real_revenda == null)
        mercadoria.valor_real_revenda = 0;

        body.importada = mercadoria.importada;
        body.disponivel = mercadoria.disponivel;
        body.valor_real = mercadoria.valor_real;
        body.valor_real_revenda = mercadoria.valor_real_revenda;  

        if (typeof (mercadoria.skus_relacionados) !== 'undefined') 
        body.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else body.skus_relacionados= [];

        console.log(body);
        if (await ctrl.update(body).catch(on_error) != undefined)
          bodies.push(body);

    }));

    return res.send(`\x1b[32mVocê atualizou um total de \x1b[0m\x1b[35m${bodies.length} \x1b[32mmercadoias no banco de dados\x1b[0m` +
      '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m de categorias no arquivo.\x1b[0m');
 
  },
 
  async get_columns(req: Request, res: Response) {
    return res.json(sMerc.skeleton.getAttributes());
  },

  async count(req: Request, res: Response) {
    const count = await ctrl.records();
    return res.json(count);
  },
}
