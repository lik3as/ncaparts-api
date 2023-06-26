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
  console.log('An error occured while trying to access Products route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

export default {
  async get_fifty(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0';

    const page: number = +(req.query.page);
    return res.json( await ctrl.getOffsetBodies(50, page))
  },

  async get_mercs_with_sku(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.rel !== 'undefined') return next();
    const sku = req.query.s;
    return res.json(await ctrl.getBodies({method: 'join_in_', on: 'prod', args: sku}));
  },

  async get_related_by_sku(req: Request, res: Response, next: NextFunction) {
    const sku = req.query.s;

    const related = await ctrl.getBodies({method: 'find_by_', on: 'related', args: sku});

    if (related == null || related.length == 0) {
      return next();
    }
    return res.json(related);
  },

  async get_related_by_name(req: Request, res: Response) {
    const name = req.query.s;
    let relateds: Mercadoria[] = [];

    const mercs = await ctrl.getBodies({method: 'find_by_', on: 'name', args: name});

    if (mercs == null){
      return res.json(null)
    }

    await Promise.all(
      mercs.map(async (merc_by_name) => {
        let related_by_sku = await ctrl.getBodies({method: 'find_by_', on: 'related', args: merc_by_name.produto.sku});
        if (related_by_sku == null) {
          related_by_sku = [];
        }

        relateds.push(merc_by_name);
        for (const merc_by_sku of related_by_sku) {
          relateds.push(merc_by_sku);
        }
      })
    );

    return res.json(relateds);
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
    merc_body.nome = mercadoria.nome;
    
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
        body.nome = mercadoria.nome;

        if (typeof (mercadoria.skus_relacionados) !== 'undefined') 
        body.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else body.skus_relacionados= [];

        bodies.push(body);
    }));

    const filtered = await ctrl.filterUniques(bodies) as Object[]
    const created_check = await ctrl.createMany(filtered).catch(on_error);
    
    const created = typeof (created_check == undefined || created_check == null) ?
    [] : created_check as Mercadoria[];

    return res.send('\x1b[32mUm total de \x1b[0m' + created.length + '\x1b[32m mercadorias foram adicionadas\x1b[0m')
  },

  async update(req: Request, res: Response, next: NextFunction) { 
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
        body.nome = mercadoria.nome;

        if (typeof (mercadoria.skus_relacionados) !== 'undefined') 
        body.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else body.skus_relacionados= [];

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