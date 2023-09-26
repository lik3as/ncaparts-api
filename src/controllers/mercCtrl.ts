import { Mercadoria, Produto, Kit, Cat, Fabricante } from "ncaparts-db";

import { Request, Response, NextFunction } from "express";
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";

const Controller = Mercadoria.Ctrl;
const Mdl = Mercadoria.Mdl;
const ctrl = new Controller();

const ProductController = Produto.Ctrl;
const ProdMdl = Produto.Mdl;
const ctrlProd = new ProductController();

const KitController = Kit.Ctrl;
const KitMdl = Kit.Mdl;
const ctrlKit = new KitController();

export default {
  async get_mercs(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.s !== 'undefined' && req.query.s != '') return next();
    if (typeof req.query.offset === 'undefined') req.query.offset = '0'
    const productType = req.query.type?.toString().toUpperCase() as string | undefined;

    try {
      if (productType) {
        const productTypeId = await ctrlProd.getCatId("Tipo", productType);
        if (!productTypeId)
          throw new Error("The ID doesn't refer to any existent Type on the database.");

        const productsFilteredByType = await ctrl.useScope({ method: 'join', param: 'tipo', args: productTypeId });

        if (productsFilteredByType) return res.json(productsFilteredByType);
        else return res.status(400).send(`${ANSI_RED}Something went wrong with your type. Check if this type really exists.${ANSI_RESET}`);
      }
      const allProducts = await ctrl.getSome(20, +req.query.offset);
      res.json(allProducts);
    } catch (e) {
      return res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);

    }
  },

  async get_mercs_with_sku(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.rel !== 'undefined') return next();
    const sku: string | undefined = req.query.s?.toString();

    try {
      if (!sku) {
        return res.status(400).send("400 - Bad Request: Invalid SKU");
      }

      const mercadoria = await ctrl.findByUnique(sku);
      if (!mercadoria) {
        return res.status(400).send("Bad Request: Inexistent SKU");
      }

      return res.json(mercadoria);
    } catch (e) {
      return res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);

    }
  },

  async get_sugestions(req: Request, res: Response, next: NextFunction) {
    const sku = req.query.s;

    try {
      if (typeof sku !== 'string')
        throw new Error(`${ANSI_RED}Was expect string, received ${ANSI_RESET}${ANSI_MAGENTA}${typeof sku}${ANSI_RESET}`)

      const produto = await ctrlProd.findByUnique(sku);

      if (!produto)
        throw new Error(`This SKU (${sku}) does not refer to any product.`)

      const relatedMercs = await ctrl.useScope({ method: 'find', param: 'related', args: sku }, true);

      if (!!!relatedMercs.length) {
        /**
         * Deixa apenas os IDs dos tipos não nulos
         */
        const tipos = produto.tipos.filter((t) => typeof t.nome === 'string').map((v) => v.id);

        if (!tipos || tipos.length === 0) {
          throw new Error("")
        }

        const relatedMercs = await ctrl.useScope({ method: 'join', param: 'tipo', args: tipos[0] });
        return res.json(relatedMercs);
      }

      return res.json(relatedMercs);
    } catch (e) {
      return res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  /**
   * @param req.query
   * 
   * m -> bulk create or not, stands for "many". Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the Mercadoria.*body* or Mercadoria.*attrs* type.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (typeof query.m !== 'undefined') {
      return next();
    }

    const mercadoria: Mercadoria.body<
      string,
      string
    > | Mercadoria.attributes<"creation"> | undefined = req.body;

    try {
      if (!mercadoria)
        throw new Error("Empty body.");

      let createdInstance: Mercadoria.attributes<"default"> | null = null;
      if (query.object_type === "body") {
        const mercadoria: Mercadoria.body<string, string> = req.body;

        const produto = await ctrlProd.findByUnique(mercadoria.produto);
        const kit = (mercadoria.kit) ? await ctrlKit.findByUnique(mercadoria.kit) : null;

        if (produto === null)
          throw new Error("O SKU não referecia produto algum.")

        if (mercadoria.valor_real_revenda == null)
          mercadoria.valor_real_revenda = 0;

        const filteredInstance = await ctrl.filter(mercadoria);

        if (!filteredInstance)
          throw new Error(`Esta mercadoria já foi registrada`);

        createdInstance = await Mdl.create({ ...filteredInstance, produto: produto, kit: kit });
      } else if (query.object_type === "attrs") {
        const mercadoria: Mercadoria.attributes<"creation"> = req.body;

        const filteredInstance = await ctrl.filter(mercadoria);

        if (!filteredInstance)
          throw new Error("Esta mercadoria já foi registrada");

        createdInstance = await Mdl.create({ ...mercadoria, produto: mercadoria.produto, kit: mercadoria.kit })
      } else {
        throw new Error("O parâmetro query 'object_type' não foi satisfeito corretamente.")
      }
      return res.send(`${ANSI_GREEN}Mercadoria inserida: ${ANSI_RESET}${ANSI_BLUE}${createdInstance}${ANSI_RESET}`);

    } catch (e) {
      return res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  /**
   * @param req.query
   * 
   * u -> should update or not. Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the Mercadoria.*body* or Mercadoria.*attrs* type.
   */
  async create_many(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (typeof query.u !== "undefined") {
      return next();
    }
    const mercadorias:
      (Mercadoria.body<string, string> | Mercadoria.attributes<"creation">)[]
      | undefined = req.body;

    try {
      if (!mercadorias || mercadorias.length == 0)
        throw new Error("Body is empty.");

      /** 
       * @var created will be fulfilled in one of the two conditions;
       */
      let created: Mercadoria.attributes[] = [];
      if (query.object_type === "body") {
        const mercadorias: Mercadoria.body<string, string>[] = req.body;
        created = await Promise.all(
          (await ctrl.filter(mercadorias))
            .map(async (merc)
              : Promise<Mercadoria.attributes<"creation">> => {
              const produto = await ctrlProd.findByUnique(merc.produto);

              let kit: Kit.attributes<"default"> | null = (merc.kit)
                ? await ctrlKit.findByUnique(merc.kit)
                : null;

              if (!produto)
                throw new Error("O produto refenciado não consta no banco de dados");

              const mercAttrs = Mercadoria.bodyToAttr(
                merc, {
                produto: produto,
                kit: kit,
              }
              );

              return await Mercadoria.Mdl.create({ ...mercAttrs, fk_produto: produto.id, fk_kit: kit?.id });
            })
        );
      } else if (query.object_type === "attrs") {
        const mercadorias: Mercadoria.attributes<"creation">[] = req.body;
        const filteredAttrs = await ctrl.filter(mercadorias);

        created = await Mdl.bulkCreate(filteredAttrs, {
          include: [{
            model: Kit.Mdl,
            as: "kit"
          }, {
            model: Produto.Mdl,
            as: "produto",
            include: [
              {
                model: Fabricante.Mdl,
                as: "fabricante",
              },
              {
                model: Produto.Mdl,
                as: "produto"
              },
              { model: Cat.TipoMdl, as: "tipos" }, { model: Cat.MarcaMdl, as: "marcas" }, { model: Cat.GrupoMdl, as: "grupos" }, { model: Cat.MdloMdl, as: "modelos" }
            ]
          }]
        });
      }
      else {
        throw new Error("O parâmetro query 'object_type' não foi satisfeito corretamente.")
      }

      return res.send(`${ANSI_GREEN}Um total de ${ANSI_RESET}${created.length}${ANSI_GREEN} mercadorias foram adicionadas.${ANSI_RESET}
      ${ANSI_GREEN}Haviam ${ANSI_BLUE}${mercadorias.length}${ANSI_RESET}${ANSI_GREEN}mercadorias no objeto${ANSI_RESET}`)

    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  /**
   * @param req.query
   * 
   * object_type -> the body object type. It must be the Mercadoria.*body* or Mercadoria.*attrs* type.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const mercadorias: Mercadoria.body<
      string,
      string
    >[]
      | Mercadoria.attributes<"creation">[]
      | undefined = req.body;

    try {
      if (!mercadorias)
        throw new Error("Empty body.")

      let updatedList: (Mercadoria.attributes | null)[] = []
      if (query.object_type === "body") {
        const mercadorias: Mercadoria.body<string, string>[] = req.body;

        updatedList = (await Promise.all(mercadorias.map(
          async (mercadoria) => {
            const mercId = await ctrl.getIdByUnique(mercadoria.produto);

            if (!mercId)
              throw new Error("Impossível atualizar mercadoria inexistente, caso queira criar uma nova mercadoria, remova o parâmetro query 'update'.");

            const mercToUpdate = await Mdl.findByPk(mercId);

            if (!mercToUpdate)
              throw new Error(`Houve um erro ao tentar retornar a mercadoria de ID: ${mercId}`);

            const produto = await ctrlProd.findByUnique(mercadoria.produto),
              kit = (mercadoria.kit) ? await ctrlKit.findByUnique(mercadoria.kit) : null;

            if (!produto)
              throw new Error("Você está tentando atualizar a mercadoria com um SKU inválido.");

            /**
             * Checks if the update did nothing new. If so, null is returned, otherwise, function flows normally.
             */
            if (mercToUpdate.get({ plain: true }) === { ...mercadoria, id: mercToUpdate.id, produto: produto, kit: kit } as Mercadoria.attributes<"default">)
              return null;

            return await mercToUpdate.update({ ...mercadoria, produto: produto, kit: kit });
          }))).filter((v) => v != null);
      } else if (query.object_type === "attrs") {
        const mercadorias: Mercadoria.attributes<"creation">[] = req.body;

        updatedList = (await Promise.all(
          mercadorias.map(async (merc) => {
            const mercId = await ctrl.getIdByUnique(merc.produto.sku);

            if (!mercId)
              throw new Error(`Impossível atualizar mercadoria inexistente (SKU: ${merc.produto.sku}),
            caso queira criar uma nova mercadoria, remova o parâmetro query 'update'.`);

            const mercToUpdate = await Mdl.findByPk(mercId);

            if (!mercToUpdate)
              throw new Error(`Houve um erro ao tentar retornar a mercadoria de ID: ${mercId}`);

            const produto = await ctrlProd.findByUnique(merc.produto.sku),
              kit = (merc.kit) ? await ctrlKit.findByUnique(merc.kit.nome) : null;

            if (!produto)
              throw new Error(`Você está tentando atualizar a mercadoria com ID ${merc.id} sem uma referência de produto válida.`);

            /**
             * Checks if the update did nothing new. If so, null is returned, otherwise, function flows normally.
             */
            if (mercToUpdate.get({ plain: true }) === { ...merc, id: mercToUpdate.id, produto: produto, kit: kit } as Mercadoria.attributes<"default">)
              return null;

            return await mercToUpdate.update({ ...merc, produto: produto, kit: kit });
          }))).filter((v) => v != null);
      } else {
        throw new Error("O parâmetro object_type não foi satisfeito corretamente.")
      }

      res.send(`${ANSI_GREEN}Você atualizou um total de ${ANSI_RESET}${ANSI_MAGENTA}${updatedList.length} ${ANSI_RESET}${ANSI_GREEN}mercadorias no banco de dados${ANSI_RESET}` +
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