import { Mercadoria, Produto, Kit } from "ncaparts-db";
import { Request, Response, NextFunction } from "express";

const Controller = Mercadoria.MercCtrl;
const ctrl = new Controller();

const ProductController = Produto.ProdCtrl;
const ctrlProd = new ProductController();

const KitController = Kit.KitCtrl;
const ctrlKit = new KitController();

const on_error = (err: any) => {
  console.log('An error occured while trying to access merc route: \n' + 
  `${ANSI_RED}${err}${ANSI_RESET}`)
}

export default {
  async get_mercs(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0'
    const productType = req.query.type?.toString().toUpperCase() as string | undefined;

    if (productType) {
      const productTypeId = await ctrl_prod.getCatId("Tipo", productType);
      const products = await ctrl.getBodies({method: 'join_in_', on:  'tipo', args: productTypeId}).catch(on_error);

      if (products) return res.json(products);
      else return res.status(400).send(`${ANSI_RED}Something went wrong with your type. Check if this type really exists.${ANSI_RESET}`);
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

    return res.json(await ctrl.getBody({method: 'find_by_', on: 'unique', args: produto}));
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

    const mercadoria: Mercadoria.body<
    string,
    string
    > | undefined = req.body;

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
      return res.send("\x1b[31mEsta mercadoria já foi registrada${ANSI_RESET}");
    }

    const data = await ctrl.createOne(filtered);
    return res.send(`${ANSI_GREEN}Mercadoria inserida: ${ANSI_RESET}${ANSI_BLUE}${data}${ANSI_BLUE}`);
  },


  async create_many(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (query.a == "update") {
      return next();
    }

    const mercadorias: Mercadoria.body<
    string,
    string
    >[] | undefined = req.body;

    try {
      if (!mercadorias)
      throw new Error("Body is undefined.");

      const instancesToFilter = await Promise.all(
        mercadorias.map(
        async (mercadoria) => {
          const prodId = await ctrlProd.getIdByUnique(mercadoria.produto);
          const kitId = await ctrlKit.getIdByUnique(mercadoria.kit);

          if (prodId === null)
          throw new Error('O SKU não referencia produto algum.');

          return Mercadoria.bodyToAttr(mercadoria, { fk_kit: kitId, fk_produto: prodId });
      }));

      const filteredInstances: Mercadoria.attributes[] = await ctrl.filter(instancesToFilter);
      const created = await ctrl.create(filteredInstances);
      
      return res.send(`${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}
      ${ANSI_GREEN}Haviam ${ANSI_BLUE}${mercadorias.length}${ANSI_RESET}${ANSI_GREEN}mercadorias no objeto${ANSI_RESET}`)
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) { 
    const mercadorias: Mercadoria.body<
    string,
    string
    >[] | undefined = req.body;

    try {
      if (!mercadorias)
      throw new Error("Empty body.")

      const updatedList = await Promise.all(mercadorias.map(
        async (mercadoria) => {
          
          const instanceToUpdate = await ctrl.findByUnique(mercadoria.produto);

          if (!instanceToUpdate)
          throw new Error(`Merc (Procut SKU: ${mercadoria.produto}) not found. You should check if the product exists or if it's not currently assigned to a merchandise.`);
          
          return await instanceToUpdate.update(mercadoria);
      }));

      res.send(`${ANSI_GREEN}Você atualizou um total de ${ANSI_RESET}${ANSI_MAGENTA}${updatedList.length} ${ANSI_RESET}${ANSI_GREEN}mercadoias no banco de dados${ANSI_RESET}` +
        `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN}de categorias no arquivo.${ANSI_RESET}`);
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
        ${e}`);
    } 
  },
 
  async get_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes());
  },

  async count(req: Request, res: Response) {
    const count = await ctrl.records();
    return res.json(count);
  },
}
