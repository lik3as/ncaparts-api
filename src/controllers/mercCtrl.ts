import { Mercadoria, Produto, Kit } from "ncaparts-db";
import { Request, Response, NextFunction } from "express";

const Controller = Mercadoria.MercCtrl;
const ctrl = new Controller();

const ProductController = Produto.ProdCtrl;
const ctrlProd = new ProductController();

const KitController = Kit.KitCtrl;
const ctrlKit = new KitController();

export default {
  async get_mercs(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0'
    const productType = req.query.type?.toString().toUpperCase() as string | undefined;

    if (productType) {
      const productTypeId = await ctrlProd.getCatId("Tipo", productType);
      if (!productTypeId)
      throw new Error("The ID doesn't refer to any existent Type on the database.");
        
      const productsFilteredByType = await ctrl.useScope({method: 'join', param: 'tipo', args: productTypeId});

      if (productsFilteredByType) return res.json(productsFilteredByType);
      else return res.status(400).send(`${ANSI_RED}Something went wrong with your type. Check if this type really exists.${ANSI_RESET}`);
    }
    const allProducts = await ctrl.getOffsetBodies(25, 0);
    res.json(allProducts);
  },

  async get_mercs_with_sku(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.rel !== 'undefined') return next();
    const sku: string | undefined = req.query.s?.toString();

    if (!sku) {
      return res.status(400).send("400 - Bad Request: Invalid SKU");
    }

    const mercadoria = await ctrl.findByUnique(sku);
    if (!mercadoria) {
      return res.status(400).send("Bad Request: Inexistent SKU");
    }

    return res.json(mercadoria);
  },

  async get_sugestions(req: Request, res: Response, next: NextFunction) {
    const sku = req.query.s;

    if (typeof sku !== 'string')
    throw new Error(`${ANSI_RED}Was expect string, received ${ANSI_RESET}${ANSI_MAGENTA}${typeof sku}${ANSI_RESET}`)

    const produto = await ctrlProd.findByUnique(sku);

    if (!produto)
    throw new Error(`This SKU (${sku}) does not refer to any product.`)

    const relatedMercs = await ctrl.useScope({method: 'find', param: 'related', args: sku}, true);

    if (!!!relatedMercs.length) {
      /**
       * Deixa apenas os IDs dos tipos não nulos
       */
      const tipos = produto.tipos.filter((t) => typeof t.nome === 'string').map((v) => v.id); 

      const relatedMercs = await ctrl.useScope({method: 'join', param: 'tipo', args: tipos[0]});
      return res.json(relatedMercs);
    }

    return res.json(relatedMercs);
  },

  async create(req: Request, res: Response, next: NextFunction) {
    if (req.query.m == 'many') {
      return next();
    }

    const mercadoria: Mercadoria.body<
    string,
    string
    > | undefined = req.body;

    try {
      if (!mercadoria)
      throw new Error("Empty body.");

      const prodId = await ctrlProd.getIdByUnique(mercadoria.produto);
      const kitId = await ctrlKit.getIdByUnique(mercadoria.kit);

      if (prodId === null) 
      throw new Error("O SKU não referecia produto algum.")

      if (mercadoria.valor_real_revenda == null)
      mercadoria.valor_real_revenda = 0;

      const instanceToFilter: Mercadoria.attributes = Mercadoria.bodyToAttr(mercadoria, { fk_kit: kitId, fk_produto: prodId });
      const filteredInstances = await ctrl.filter(instanceToFilter);

      if (!filteredInstances)
      throw new Error(`${ANSI_RED}Esta mercadoria já foi registrada${ANSI_RESET}`);

      const createdInstance = await ctrl.create(filteredInstances);
      return res.send(`${ANSI_GREEN}Mercadoria inserida: ${ANSI_RESET}${ANSI_BLUE}${createdInstance}${ANSI_RESET}`);
    } catch (e) {
      return res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
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
