import { Cat, Fabricante, Mercadoria, Produto } from 'ncaparts-db'
import { ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Request, Response, NextFunction } from "express";
import { ForeignKeyConstraintError } from "sequelize"

const ctrl = new Produto.Ctrl();
const ctrlMerc = new Mercadoria.Ctrl();
const ctrlFab = new Fabricante.Ctrl();

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


export default {

  /**
   * @returns Fifty latest products ordered by name 
   */
  async latest(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.sku !== 'undefined' && req.query.sku != '') return next();

    const offset: number | undefined = +(req.query.offset ?? 0) || undefined;
    const limit: number | undefined = +(req.query.limit ?? 0) || undefined;
    try {
      res.status(200).json(await ctrl.getSome(limit, offset));
    } catch (e) {
      res.status(500).json({
        error: (e as any).toString(),
        msg: `${ANSI_RESET}Houve um erro ao retornar os produtos${ANSI_RESET}`
      });
    }
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

    } catch (e) {
      return res.status(200).json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao consultar o produto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
        ${e}`
      });
    }

    res.status(200).json(produto);
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

    const wrongCats: cats = { tipos: [], grupos: [], marcas: [], modelos: [] };
    let created: Produto.attributes<"default">[] = [];
    try {
      if (!produtos)
        throw new Error("O corpo da requisição não pode estar vazio.");


      if (query.object_type === "body") {
        const produtos: Produto.body<string, string, string, string[], string[], string[], string[]>[] = req.body;
        created = (await Promise.all(
          (await ctrl.filter(produtos))
            .map(async (produto) => {
              const tipos = await Promise.all(produto.tipos.map(async (t) => {
                const id = await ctrl.getCatId("Tipos", t.toUpperCase());
                if (!id) wrongCats.tipos.push(t);
                return id ? await Cat.TipoMdl.findByPk(id, { raw: true }) : null;
              }).filter((v, i, arr) => v != null && arr.indexOf(v) === i)) as Cat.attributes<"default">[]; /** Filtra categorias inexistentes e repetidas. */

              const grupos: (Cat.attributes | null)[] = await Promise.all(produto.grupos.map(async (g) => {
                const id = await ctrl.getCatId("Grupos", g.toUpperCase());
                if (!id) wrongCats.grupos.push(g);
                return id ? await Cat.GrupoMdl.findByPk(id) : null;
              }).filter((v, i, arr) => v != null && arr.indexOf(v) === i)) as Cat.attributes<"default">[]; /** Filtra categorias inexistentes e repetidas. */

              const modelos: (Cat.attributes | null)[] = await Promise.all(produto.modelos.map(async (m) => {
                const id = await ctrl.getCatId("Modelos", m.toUpperCase());
                if (!id) wrongCats.modelos.push(m);
                return id ? await Cat.MdloMdl.findByPk(id) : null;
              }).filter((v, i, arr) => v != null && arr.indexOf(v) === i)) as Cat.attributes<"default">[]; /** Filtra categorias inexistentes e repetidas. */

              const marcas = await Promise.all(produto.marcas.map(async (m) => {
                const id = await ctrl.getCatId("Marcas", m.toUpperCase());
                if (!id) wrongCats.marcas.push(m);
                return id ? await Cat.MarcaMdl.findByPk(id) : null;
              }).filter((v, i, arr) => v != null && arr.indexOf(v) === i)) as Cat.attributes<"default">[]; /** Filtra categorias inexistentes e repetidas. */

              const fabricante = await ctrlFab.findByUnique(produto.fabricante),
                mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria) : null,
                subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto) : null;

              if (!fabricante)
                throw new Error(`Você não pode inserir  um produto sem um fabricante válido!
              Produto: ${produto.sku}
              Fabricante: ${produto.fabricante}`);

              const produtoToCreate = Produto.bodyToAttr(
                produto,
                {
                  tipos: tipos.filter((v) => v != null) as Cat.attributes<"default">[],
                  grupos: grupos.filter((v) => v != null) as Cat.attributes<"default">[],
                  modelos: modelos.filter((v) => v != null) as Cat.attributes<"default">[],
                  marcas: marcas.filter((v) => v != null) as Cat.attributes<"default">[],
                  mercadoria: mercadoria,
                  produto: subProduto,
                  fabricante: fabricante
                }
              )

              try {
                const createdProduto = await Produto.Mdl.create({ ...produtoToCreate, fk_fabricante: fabricante.id, fk_produto: subProduto?.id });
                await createdProduto.$add("tipos", produtoToCreate.tipos.map((t) => t.id!));
                await createdProduto.$add("marcas", produtoToCreate.marcas.map((m) => m.id!));
                await createdProduto.$add("modelos", produtoToCreate.modelos.map((m) => m.id!));
                await createdProduto.$add("grupos", produtoToCreate.grupos.map((g) => g.id!));

                return createdProduto;
              } catch (e) {
                return null
              }
            }
            )
        )).filter((v) => v != null) as Produto.attributes<"default">[];

      } else if (query.object_type === "attrs") {
        const produtos: Produto.attributes<"creation">[] = req.body;

        const filtered = await ctrl.filter(produtos);

        created = await Produto.Mdl.bulkCreate(filtered, {
          include: [
            {
              model: Mercadoria.Mdl,
              as: "mercadoria"
            },
            {
              model: Produto.Mdl,
              as: "produto"
            }, {
              model: Fabricante.Mdl,
              as: "fabricante"
            }, { model: Cat.TipoMdl, as: "tipos" }, { model: Cat.MarcaMdl, as: "marcas" }, { model: Cat.GrupoMdl, as: "grupos" }, { model: Cat.MdloMdl, as: "modelos" }
          ]
        });
      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }

    } catch (e) {
      res.status(500).json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. ${ANSI_RESET}`
      });

    }

    res.status(200).json({  
      msg: `${ANSI_GREEN}Você registrou um total de ${ANSI_RESET}${ANSI_MAGENTA}${created.length} ${ANSI_GREEN}produtos no banco de dados${ANSI_RESET}` +
      `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} de produtos no arquivo.${ANSI_RESET}.
      Cheque as seguintes categorias (se nada houver, você escreveu todas corretamente.): 
      ${(wrongCats.tipos.length > 0) ? `tipos: ${wrongCats.tipos}` : ""}
      ${(wrongCats.grupos.length > 0) ? `grupos: ${wrongCats.grupos}` : ""}
      ${(wrongCats.modelos.length > 0) ? `modelos: ${wrongCats.modelos}` : ""}
      ${(wrongCats.marcas.length > 0) ? `marcas: ${wrongCats.marcas}` : ""}
    `});
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


    const wrongCats: cats = { tipos: [], grupos: [], marcas: [], modelos: [] };
    let updated: Produto.attributes[] = [];
    try {
      if (!produtos)
        throw new Error("O corpo da requisição está vazio.");

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
              if (!id) wrongCats.tipos.push(t);
              return id ? await Cat.TipoMdl.findByPk(id) : null;
            }))

            const grupos = await Promise.all(produto.grupos.map(async (g) => {
              const id = await ctrl.getCatId("Grupos", g);
              if (!id) wrongCats.grupos.push(g);
              return id ? await Cat.GrupoMdl.findByPk(id) : null;
            }));

            const modelos = await Promise.all(produto.modelos.map(async (m) => {
              const id = await ctrl.getCatId("Modelos", m);
              if (!id) wrongCats.modelos.push(m);
              return id ? await Cat.MdloMdl.findByPk(id) : null;
            }));

            const marcas = await Promise.all(produto.marcas.map(async (m) => {
              const id = await ctrl.getCatId("Marcas", m);
              if (!id) wrongCats.marcas.push(m);
              return id ? await Cat.MarcaMdl.findByPk(id) : null;
            }));

            const subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto) : null;
            const mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria) : null;

            const fabricante = await ctrlFab.findByUnique(produto.fabricante);

            if (!fabricante)
              throw new Error(`Você não pode atualizar um produto sem o fabricante! Produto: ${produto.sku}`);

            return await prodToUpdate.update({
              ...produto,
              produto: subProduto,
              mercadoria: mercadoria,
              fabricante: fabricante,
              tipos: tipos.filter((v) => v != null) as Cat.attributes<"default">[],
              grupos: grupos.filter((v) => v != null) as Cat.attributes<"default">[],
              modelos: modelos.filter((v) => v != null) as Cat.attributes<"default">[],
              marcas: marcas.filter((v) => v != null) as Cat.attributes<"default">[]
            })
          }))

      } else if (query.object_type === "attrs") {
        const mercadorias: Produto.attributes<"creation">[] = req.body;

        updated = await Promise.all(mercadorias.map(async (produto) => {
          const produtoId = await ctrl.getIdByUnique(produto.sku),
            produtoToUpdate = await Produto.Mdl.findByPk(produtoId);

          if (!produtoToUpdate)
            throw new Error(`Não há produto com o SKU especificado: (${produto.sku})`)

          produto.tipos = produto.tipos.map((v) => ({ ...v, nome: v.nome.toUpperCase() }));
          produto.grupos = produto.grupos.map((v) => ({ ...v, nome: v.nome.toUpperCase() }));
          produto.modelos = produto.modelos.map((v) => ({ ...v, nome: v.nome.toUpperCase() }));
          produto.marcas = produto.marcas.map((v) => ({ ...v, nome: v.nome.toUpperCase() }));


          const fabricante = await ctrlFab.findByUnique(produto.fabricante.cnpj),
            subProduto = (produto.produto) ? await ctrl.findByUnique(produto.produto.sku) : null,
            mercadoria = (produto.mercadoria) ? await ctrlMerc.findByUnique(produto.mercadoria.produto.sku) : null,
            tipos = await Promise.all(produto.tipos.map(async (t) => {
              const id = await ctrl.getCatId("Tipos", t.nome);
              if (!id) wrongCats.tipos.push(t.nome);
              return id ? await Cat.TipoMdl.findByPk(id) : null;
            })),
            grupos = await Promise.all(produto.grupos.map(async (g) => {
              const id = await ctrl.getCatId("Grupos", g.nome);
              if (!id) wrongCats.grupos.push(g.nome);
              return id ? await Cat.GrupoMdl.findByPk(id) : null;
            })),
            marcas = await Promise.all(produto.marcas.map(async (m) => {
              const id = await ctrl.getCatId("Marcas", m.nome);
              if (!id) wrongCats.marcas.push(m.nome);
              return id ? await Cat.MarcaMdl.findByPk(id) : null;
            })),
            modelos = await Promise.all(produto.modelos.map(async (m) => {
              const id = await ctrl.getCatId("Modelos", m.nome);
              if (!id) wrongCats.modelos.push(m.nome);
              return id ? await Cat.MdloMdl.findByPk(id) : null;
            }));

          if (!fabricante)
            throw new Error(`Você não pode atualizar um produto sem o fabricante! Produto: ${produto.sku}`);

          return await produtoToUpdate.update({
            ...produto,
            fabricante: fabricante,
            tipos: tipos.filter((v) => v != null) as Cat.attributes<"default">[],
            grupos: grupos.filter((v) => v != null) as Cat.attributes<"default">[],
            marcas: marcas.filter((v) => v != null) as Cat.attributes<"default">[],
            modelos: modelos.filter((v) => v != null) as Cat.attributes<"default">[],
            produto: subProduto,
            mercadoria: mercadoria
          });
        }))
      } else {
        throw new Error("O parâmetro query object_type não foi satisfeito corretamente.");
      }

    } catch (e) {
      return res.status(500).json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao atualizar os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      });
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você atualizou um total de ${ANSI_RESET}${ANSI_MAGENTA}${updated.length} ${ANSI_GREEN}produtos no banco de dados${ANSI_RESET}` +
      `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} de produtos no arquivo.${ANSI_RESET}.
      Cheque as seguintes categorias (se nada houver, você escreveu todas corretamente.): 
      ${(!!!wrongCats.tipos.length) ? `tipos: ${wrongCats.tipos}` : ""})
      ${(!!!wrongCats.grupos.length) ? `grupos: ${wrongCats.grupos}` : ""})
      ${(!!!wrongCats.modelos.length) ? `modelos: ${wrongCats.modelos}` : ""})
      ${(!!!wrongCats.marcas.length) ? `marcas: ${wrongCats.marcas}` : ""})
    `});
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    const catOrCats: Cat.body
      | Cat.body[]
      | undefined = req.body;

    try {
      if (!catOrCats)
        throw new Error("O corpo da requisição está vazio.");

      if (Array.isArray(catOrCats)) {

        /**
         * All cats are uppercased.
         */
        const uppercasedCats: Cat.attributes<"creation">[] = catOrCats.map((cat) => ({
          nome: cat.nome.toUpperCase()
        }))

        const created = await ctrl.createCategoria(req.params.cat, uppercasedCats) as Cat.attributes[];

        return res.status(200).json({
          msg: `${ANSI_GREEN}Você registrou um total de ${ANSI_RESET}${ANSI_MAGENTA}${created.length}${ANSI_RESET} ${ANSI_GREEN}no banco de dados${ANSI_RESET}` +
          `\n${ANSI_GREEN}Haviam ${ANSI_RESET}${ANSI_MAGENTA} ${req.body.length} ${ANSI_RESET}${ANSI_GREEN} produtos no arquivo.${ANSI_RESET}`
        });
      }

      catOrCats.nome = catOrCats.nome.toUpperCase();
      await ctrl.createCategoria(req.params.cat, catOrCats);

    } catch (e) {
      return res.status(500).json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      })
    }
    
    res.status(200).json({
      msg: `${ANSI_GREEN}Você registrou ${ANSI_RESET}${ANSI_MAGENTA}${catOrCats}${ANSI_RESET}${ANSI_GREEN}no banco de dados.${ANSI_RESET}`
    });
  },

  /**
   * need docs
   * @param req.query.sku is the unique;
   */
  async delete_produto(req: Request, res: Response) {
    const query = req.query;

    let destroyedRows = 0;
    try {
      if (typeof query.sku !== "string") 
      throw new Error("O SKU fornecido não foi uma string. " + `(${typeof query.sku})`);

      const sku = query.sku;
      const id = await ctrl.getIdByUnique(sku);

      if (!id)
      throw new Error("Este produto não existe no banco de dados. " + `(${sku})`);

      destroyedRows = await Mdl.destroy({where: { id: id } });

    } catch (e) {
      return res.json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      })
    }
    res.json(`${ANSI_GREEN}Você removeu com sucesso ${ANSI_RESET}${ANSI_MAGENTA}${destroyedRows}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`);

  },

  /**
   * need docs
   * todo -> cat is confusing, must change to "type" or something, then, "name" must be "cat"
   * @param req.query.name is the unique;
   * @param req.query.cat is the cat;
   */
  async delete_cat(req: Request, res: Response) {
    const query = req.query;
    const params = req.params;
    
    let destroyedRows = 0;
    try {
      if (typeof query.name !== 'string')
      throw new Error("O nome fornecido não foi uma string. " +  `(${typeof query.name})`);

      if (typeof params.cat !== 'string')
      throw new Error("A categoria fornecida não foi uma string. " +  `(${typeof query.name})`);

      const name = query.name;
      const id = await ctrl.getCatId(params.cat, name);

      if (!id)
      throw new Error("Não foi encontrada nenhuma categoria com este nome");

      switch (params.cat) {
        case "Tipos": {
          destroyedRows = await Cat.TipoMdl.destroy({ where: {id: id } });
          break;
        }
        case "Grupos": {
          destroyedRows = await Cat.GrupoMdl.destroy({ where: {id: id } });
          break;
        }
        case "Marcas": {
          destroyedRows = await Cat.MarcaMdl.destroy({ where: {id: id } });
          break;
        }
        case "Modelos": {
          destroyedRows = await Cat.MdloMdl.destroy({ where: {id: id } });
          break;
        }
      }
    } catch (e) {
      return res.status(500).json({
        error: (e as any).toString(),
        msg: `${ANSI_RED}Houve um erro ao deletar a tupla indicada. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}
        ${e}`
      })
    }
    res.status(200).json({
      msg: `${ANSI_GREEN}Você removeu com sucesso ${ANSI_RESET}${ANSI_MAGENTA}${destroyedRows}${ANSI_RESET} ${ANSI_GREEN}registros do banco de dados${ANSI_RESET}`
    });
  }, 

  async get_categorias(req: Request, res: Response) {
    try {
      res.json(await ctrl.getCats(req.params.cat));
    } catch (e) {
      res.status(500).json({
        error: (e as any).toString(),
        message: `${ANSI_RED}Ocorreu um erro ao tentar retornar as categorias especificadas.${ANSI_RESET}`
      })
    }
  },

  async get_cat_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes());
  },


  async get_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes())
  }

};
