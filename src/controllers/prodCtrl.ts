import { Cat, Fabricante, Mercadoria, Produto } from 'ncaparts-db'
import { ANSI_BLUE, ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Request, Response, NextFunction } from "express";

const ctrl = new Produto.ProdCtrl();
const ctrlMerc = new Mercadoria.MercCtrl();
const ctrlFab = new Fabricante.FabCtrl();

const Mdl = Produto.Mdl

type cats = {
  tipos: string[],
  grupos: string[],
  modelos: string[],
  marcas: string[]
};

const on_error = (err: any) => {
  console.log('An error occured while trying to access prod route: \n' +
    `${ANSI_RED}${err}${ANSI_RESET}`)
}

const assertCatId = async (id: number | null, cName: "tp" | "gp" | "ma" | "mo", falsy?: Function) => {
  if (id) {
    switch (cName) {
      case "tp": return await Cat.TipoMdl.findByPk(id) as Cat.attributes<"default">;
      case "gp": return await Cat.GrupoMdl.findByPk(id) as Cat.attributes<"default">;
      case "ma": return await Cat.MarcaMdl.findByPk(id) as Cat.attributes<"default">;
      case "mo": return await Cat.MdloMdl.findByPk(id) as Cat.attributes<"default">;
    }
  }
  else {
    (falsy) ? falsy() : void (0);
    switch (cName) {
      case "tp": return await Cat.TipoMdl.findByPk(0) as Cat.attributes<"default">;
      case "gp": return await Cat.GrupoMdl.findByPk(0) as Cat.attributes<"default">;
      case "ma": return await Cat.MarcaMdl.findByPk(0) as Cat.attributes<"default">;
      case "mo": return await Cat.MdloMdl.findByPk(0) as Cat.attributes<"default">;
    }
  }

}


export default {

  /**
   * @returns Fifty latest products ordered by name 
   */
  async latest(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.sku !== 'undefined' && req.query.sku != '') return next();
    if (typeof req.query.page === 'undefined') req.query.page = '0'

    const page: number = +(req.query.page);
    return res.json(await ctrl.getAllBodies(page).catch(on_error));
  },

  async count(req: Request, res: Response, next: NextFunction) {
    const count = await ctrl.records();
    return res.json(count);
  },

  async getOne(req: Request, res: Response) {
    const sku: string = req.query.sku as string;

    const produto = await ctrl.findByUnique(sku);

    try {
      if (!produto)
      throw new Error("Este SKU não corresponde a nenhum produto: " + sku);

      res.json(produto);
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao consultar o produto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },


  /**
   * @param req.query
   * 
   * u -> should update or not. Boolean by existence (undefined or not undefined);
   * 
   * object_type -> the body object type. It must be the Produto.*body* or Produto.*attrs* type.
   */
  async create_many(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (query.u == "update") {
      return next();
    }

    const produtos: 
    (Produto.body<string, string, string, string[], string[], string[], string[]>
    | Produto.attributes<"creation">)[]
    | undefined = req.body;

    try {
      if (!produtos)
      throw new Error("O corpo da requisição não pode estar vazio.");

      const wrongCats: cats = { tipos: [], grupos: [], marcas: [], modelos: [] };
      let created: Produto.attributes<"default">[] = [];

      if (query.object_type === "body") {
        const produtos: Produto.body<string, string, string, string[], string[], string[], string[]>[] = req.body;
        const filteredAndConverted = await Promise.all(
          (await ctrl.filter(produtos))
          .map(async (produto)
            : Promise<Produto.attributes<"creation">> => {
                const tipos = await Promise.all(produto.tipos.map(async (t) => {
                  const id = await ctrl.getCatId("Tipos", t);
                  return assertCatId(id, "tp", () => wrongCats.tipos.push(t));
                }))

                const grupos = await Promise.all(produto.grupos.map(async (g) => {
                  try {
                    const id = await ctrl.getCatId("Grupos", g);
                    return assertCatId(id, "gp", () => wrongCats.grupos.push(g))
                  } catch (e) {
                    throw new Error("Error in grupos conversion to surrogate");
                  }
                }));

                const modelos = await Promise.all(produto.modelos.map(async (m) => {
                  try {
                    const id = await ctrl.getCatId("Modelos", m);
                    return assertCatId(id, "mo", () => wrongCats.modelos.push(m));
                  } catch (e) {
                    throw new Error("Error in modelos conversion to surrogate");
                  }
                }));

                const marcas = await Promise.all(produto.marcas.map(async (m) => {
                  try {
                    const id = await ctrl.getCatId("Marcas", m);
                    return assertCatId(id, "ma", () => wrongCats.marcas.push(m));
                  } catch (e) {
                    throw new Error("Error in marcas conversion to surrogate")
                  }
                }));

              console.log("nothing wrong til here :)");

              const fabricante = await ctrlFab.findByUnique(produto.fabricante),
              mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria) : null,
              subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto) : null;

              if (!fabricante)
              throw new Error(`Você não pode inserir  um produto sem o fabricante! Produto: ${produto.sku}`);

              return {
                ...produto,
                tipos: tipos,
                grupos: grupos,
                modelos: modelos,
                marcas: marcas,
                mercadoria: mercadoria,
                produto: subProduto,
                fabricante: fabricante
              }
            }
          )
        );

        created = await Produto.Mdl.bulkCreate(filteredAndConverted);
      } else if (query.object_type === "attrs") {
        const produtos: Produto.attributes<"creation">[] = req.body;

        const filtered = await ctrl.filter(produtos);

        created = await Produto.Mdl.bulkCreate(filtered);
      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      } 

      return res.send(`${ANSI_GREEN}Você registrou um total de ${ANSI_RESET}${ANSI_MAGENTA}${created.length} ${ANSI_GREEN}produtos no banco de dados${ANSI_RESET}` +
        `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} de produtos no arquivo.${ANSI_RESET}.
        Cheque as seguintes categorias (se nada houver, você escreveu todas corretamente.): 
        ${ (!!!wrongCats.tipos.length) ? `tipos: ${wrongCats.tipos}` : "" })
        ${ (!!!wrongCats.grupos.length) ? `grupos: ${wrongCats.grupos}` : "" })
        ${ (!!!wrongCats.modelos.length) ? `modelos: ${wrongCats.modelos}` : "" })
        ${ (!!!wrongCats.marcas.length) ? `marcas: ${wrongCats.marcas}` : "" })
      `);

    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}
      ${e}`);

    }
  },

  /**c
   * @param req.query
   * 
   * object_type -> the body object type. It must be the Mercadoria.*body* or Mercadoria.*attrs* type.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    const produtos: (Produto.body<
      string, string,
      string,
      string[],
      string[],
      string[],
      string[]>
      | Produto.attributes<"creation">)[]
      | undefined = req.body;


    try {
      if (!produtos)
        throw new Error("Body is empty.");

      let updated: Produto.attributes[] = [];
      const wrongCats: cats = { tipos: [], grupos: [], marcas: [], modelos: [] };
      if (query.object_type === "body") {
        const produtos: Produto.body<
        string, string,
        string,
        string[],
        string[],
        string[],
        string[]>[] = req.body;

        updated = await Promise.all(
          produtos.map(async (produto) => {
            produto.tipos = produto.tipos.map((v) => v.toUpperCase());
            produto.grupos = produto.grupos.map((v) => v.toUpperCase());
            produto.modelos = produto.modelos.map((v) => v.toUpperCase());
            produto.marcas = produto.marcas.map((v) => v.toUpperCase());

            const prodId = await ctrl.getIdByUnique(produto.sku);
            const prodToUpdate = await Mdl.findByPk(prodId);

            if (!prodToUpdate)
            throw new Error(`Não há produto com o SKU especificado: (${produto.sku})`)


            /** Instead of using ctrl.getCatId, use the methods of the upcoming class "Categorias"
             * 
             * This "Cats" section of the middleware just take all of the unique strings in each
             * category and spits the respective Cat Tuple in the Cat.attrs<"creation"> format.
             * 
             * Further on, it's almost the same. A conversion of string values defined in Produto.body<string...>
             * in the respective attrs types.
             */
            const tipos = await Promise.all(produto.tipos.map(async (t) => {
              const id = await ctrl.getCatId("Tipos", t);
              return assertCatId(id, "tp", () => wrongCats.tipos.push(t));
            }))

            const grupos = await Promise.all(produto.grupos.map(async (g) => {
              const id = await ctrl.getCatId("Grupos", g);
              return assertCatId(id, "gp", () => wrongCats.grupos.push(g))
            }));

            const modelos = await Promise.all(produto.modelos.map(async (m) => {
              const id = await ctrl.getCatId("Modelos", m);
              return assertCatId(id, "mo", () => wrongCats.modelos.push(m));
            }));

            const marcas = await Promise.all(produto.marcas.map(async (m) => {
              const id = await ctrl.getCatId("Marcas", m);
              return assertCatId(id, "ma", () => wrongCats.marcas.push(m));
            }));

            const subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto) : null;
            const mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria) : null;

            const fabricante = await ctrlFab.findByUnique(produto.fabricante);

            if (!fabricante)
            throw new Error(`Você não pode atualizar um produto sem o fabricante! Produto: ${produto.sku}`);

            return await prodToUpdate.update({
              ...produto, produto: subProduto, mercadoria: mercadoria, fabricante: fabricante,
              tipos: tipos, grupos: grupos, modelos: modelos, marcas: marcas
            });
          }))

      } else if (query.object_type === "attrs") {
        const mercadorias: Produto.attributes<"creation">[] = req.body;

        updated = await Promise.all(mercadorias.map(async (produto) => {
          const produtoId = await ctrl.getIdByUnique(produto.sku),
          produtoToUpdate = await Produto.Mdl.findByPk(produtoId);

          if (!produtoToUpdate)
          throw new Error(`Não há produto com o SKU especificado: (${produto.sku})`)
          
          produto.tipos = produto.tipos.map((v) => ({...v, nome: v.nome.toUpperCase()}));
          produto.grupos = produto.grupos.map((v) => ({...v, nome: v.nome.toUpperCase()}));
          produto.modelos = produto.modelos.map((v) => ({...v, nome: v.nome.toUpperCase()}));
          produto.marcas = produto.marcas.map((v) => ({...v, nome: v.nome.toUpperCase()}));
          
          
          const fabricante = await ctrlFab.findByUnique(produto.fabricante.cnpj),
          subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto.sku) : null,
          mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria.produto.sku) : null,
          tipos = await Promise.all(produto.tipos.map(async (t) => {
            const id = await ctrl.getCatId(t.nome, "Tipos");
            return assertCatId(id, "tp", () => wrongCats.tipos.push(t.nome));
          })),
          grupos = await Promise.all(produto.grupos.map(async (g) => {
            const id = await ctrl.getCatId(g.nome, "Grupos");
            return assertCatId(id, "gp", () => wrongCats.grupos.push(g.nome));
          })),
          marcas = await Promise.all(produto.marcas.map(async (m) => {
            const id = await ctrl.getCatId(m.nome, "Marcas");
            return assertCatId(id, "ma", () => wrongCats.marcas.push(m.nome));
          })),
          modelos = await Promise.all(produto.modelos.map(async (m) => {
            const id = await ctrl.getCatId(m.nome, "Modelos");
            return assertCatId(id, "mo", () => wrongCats.modelos.push(m.nome));
          }));

          if (!fabricante)
          throw new Error(`Você não pode atualizar um produto sem o fabricante! Produto: ${produto.sku}`);

          return await produtoToUpdate.update({...produto, fabricante: fabricante, tipos: tipos, grupos: grupos, marcas: marcas, modelos: modelos, produto: subProduto, 
          mercadoria: mercadoria});
        }))
      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }
      return res.send(`${ANSI_GREEN}Você atualizou um total de ${ANSI_RESET}${ANSI_MAGENTA}${updated.length} ${ANSI_GREEN}produtos no banco de dados${ANSI_RESET}` +
        `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} de produtos no arquivo.${ANSI_RESET}.
        Cheque as seguintes categorias (se nada houver, você escreveu todas corretamente.): 
        ${ (!!!wrongCats.tipos.length) ? `tipos: ${wrongCats.tipos}` : "" })
        ${ (!!!wrongCats.grupos.length) ? `grupos: ${wrongCats.grupos}` : "" })
        ${ (!!!wrongCats.modelos.length) ? `modelos: ${wrongCats.modelos}` : "" })
        ${ (!!!wrongCats.marcas.length) ? `marcas: ${wrongCats.marcas}` : "" })
      `);

    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    const catOrCats: Cat.body
      | Cat.body[]
      | undefined = req.body;

    try {
      if (!catOrCats)
        throw new Error("Body is empty.");

      if (Array.isArray(catOrCats)) {

        /**
         * All cats are uppercased.
         */
        const uppercasedCats: Cat.attributes<"creation">[] = catOrCats.map((cat) => ({
          nome: cat.nome.toUpperCase()
        }))

        const created = await ctrl.createCategoria(req.params.cat, uppercasedCats) as Cat.attributes[];

        return res.send(`${ANSI_GREEN}Você registrou um total de ${ANSI_RESET}${ANSI_MAGENTA}${created.length} ${ANSI_GREEN}no banco de dados${ANSI_RESET}` +
          `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} produtos no arquivo.${ANSI_RESET}`);
      }

      catOrCats.nome = catOrCats.nome.toUpperCase();
      await ctrl.createCategoria(req.params.cat, catOrCats).catch(on_error);

      return res.send(`${ANSI_GREEN}Você registrou ${ANSI_RESET}${ANSI_MAGENTA}${catOrCats} ${ANSI_RESET}${ANSI_GREEN}no banco de dados.${ANSI_RESET}`);
    } catch (e) {
      res.send(`${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
      ${e}`);
    }
  },

  async get_categorias(req: Request, res: Response) {
    return res.json(await ctrl.getCats(req.params.cat).catch(on_error));
  },

  async get_cat_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes());
  },

  async get_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes())
  }

};
