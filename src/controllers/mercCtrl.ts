import { Mercadoria as _Mercadoria, Produto as _Produto, Kit as _Kit } from "ncaparts-db";
import { Request, Response, NextFunction } from "express";

const { Mercadoria, MercCtrl } = _Mercadoria,
  { Produto, ProdCtrl } = _Produto,
  { Kit, KitCtrl } = _Kit;

const ctrl = new MercCtrl();
const ctrl_prod = new ProdCtrl();
const ctrl_kit = new KitCtrl();
const instance = new Mercadoria();

const on_error = (err: any) => {
  console.log('An error occured while trying to access merc route: \n' +
    `\x1b[31m${err}\x1b[0m`)
}

export default {
  async get_mercs(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0'
    const productType = req.query.type?.toString().toUpperCase() as string | undefined;

    if (productType) {
      const productTypeId = await ctrl_prod.getCatId("Tipo", productType);
      const products = await ctrl.getBodies({ method: 'join_in_', on: 'tipo', args: productTypeId }).catch(on_error);

      if (products) return res.json(products);
      else return res.status(400).send("\x1b[32mSomething went wrong with your type. Check if this type really exists.\x1b[0m");
    }

    res.json(await ctrl.getOffsetBodies(25, 0));
  },

  async get_mercs_with_sku(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.rel !== 'undefined') return next();
    const sku: string | undefined = req.query.s?.toString();

    if (!sku) {
      return res.status(400).send("400 - Bad Request: Invalid SKU");
    }

    const produto = await ctrl_prod.getId(sku);
    if (!produto) {
      return res.status(400).send("Bad Request: Inexistent SKU");
    }

    return res.json(await ctrl.getBody({ method: 'find_by_', on: 'unique', args: produto }));
  },

  async get_sugestions(req: Request, res: Response, next: NextFunction) {
    const sku = req.query.s as string;

    const prodId = (await ctrl_prod.getId(sku))!;

    const merc = await ctrl.getBody({ method: "find_by_", on: "unique", args: prodId })!;
    const tipoID = await ctrl_prod.getCatId("Tipo", merc?.produto.tipo.nome!);

    const related = await ctrl.getBodies({ method: 'find_by_', on: 'related', args: sku });

    if (!related || related.length == 0) { //Nenhum elemento relacionado.
      const relatedByType = await ctrl.getBodies({ method: 'join_in_', on: 'tipo', args: tipoID });
      return res.json(relatedByType);
    }

    return res.json(related);
  },

  async create(req: Request, res: Response, next: NextFunction) {
    if (req.query.m == 'many') {
      return next();
    }

    const mercadoria: any = req.body;
    const mercToInsert = new Mercadoria();

    const prodId = (await ctrl_prod.getBody({
      method: 'find_by_',
      on: 'unique',
      args: mercadoria.produto
    }))?.id;

    let kitId: number | undefined;
    if (mercadoria.kit != null) {
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
      mercToInsert.id_kit = kitId;

    mercToInsert.id_produto = prodId;
    mercToInsert.importada = mercadoria.importada;
    mercToInsert.disponivel = mercadoria.disponivel;
    mercToInsert.valor_real = mercadoria.valor_real;
    mercToInsert.valor_real_revenda = mercadoria.valor_real_revenda;

    if (typeof (mercadoria.skus_relacionados) !== 'undefined') {
      let skus_relacionados: string[] = [];
      (mercadoria.skus_relacionados as string).
        split(',').map((val) => { skus_relacionados.push(val.trim()) });
      mercToInsert.skus_relacionados = skus_relacionados;
    }
    else mercToInsert.skus_relacionados = [];

    const filtered = await ctrl.filterUniques(mercToInsert);
    if (!filtered) {
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

    const mercadorias: any[] = req.body;
    const instances: typeof instance[] = [];

    await Promise.all(mercadorias.map(
      async (mercadoria) => {
        const instance = new Mercadoria();

        const prodId = (await ctrl_prod.getBody({
          method: 'find_by_',
          on: 'unique',
          args: mercadoria.produto
        }))?.id;

        let kitId: number | undefined;
        if (mercadoria.kit != null) {
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
          instance.id_kit = kitId;

        instance.id_produto = prodId;
        instance.importada = mercadoria.importada;
        instance.disponivel = mercadoria.disponivel;
        instance.valor_real = mercadoria.valor_real;
        instance.valor_real_revenda = mercadoria.valor_real_revenda;

        if (typeof (mercadoria.skus_relacionados) !== 'undefined')
          instance.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else instance.skus_relacionados = [];

        instances.push(instance);
      }));

    const filtered = await ctrl.filterUniques(instances);
    const created_check = await ctrl.createMany(filtered).catch(on_error);

    const created = created_check ?? [];

    return res.send('\x1b[32mUm total de \x1b[0m' + created.length + '\x1b[32m mercadorias foram adicionadas\x1b[0m')
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const mercadorias: any[] = req.body;
    let bodies: _Mercadoria.attributes[] = [];

    await Promise.all(mercadorias.map(
      async (mercadoria) => {
        const prodId = (await ctrl_prod.getId(mercadoria.produto))!;
        const body: _Mercadoria.attributes = (await ctrl.getBody({ method: 'find_by_', on: 'unique', args: prodId }))?.get({ plain: true })!;

        if (mercadoria.valor_real_revenda == null)
          mercadoria.valor_real_revenda = 0;

        body.importada = mercadoria.importada;
        body.disponivel = mercadoria.disponivel;
        body.valor_real = mercadoria.valor_real;
        body.valor_real_revenda = mercadoria.valor_real_revenda;

        if (typeof (mercadoria.skus_relacionados) !== 'undefined')
          body.skus_relacionados = (mercadoria.skus_relacionados as string).split(',');
        else body.skus_relacionados = [];

        console.log(body);
        if (await ctrl.update(body).catch(on_error) != undefined)
          bodies.push(body);

      }));

    return res.send(`\x1b[32mVocê atualizou um total de \x1b[0m\x1b[35m${bodies.length} \x1b[32mmercadoias no banco de dados\x1b[0m` +
      '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m de categorias no arquivo.\x1b[0m');

  },

  async get_columns(req: Request, res: Response) {
    return res.json(Mercadoria.getAttributes());
  },

  async count(req: Request, res: Response) {
    const count = await ctrl.records();
    return res.json(count);
  },
}
