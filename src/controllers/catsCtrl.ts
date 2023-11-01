import { Cat, Produto } from 'ncaparts-db'
import { ANSI_GREEN, ANSI_MAGENTA, ANSI_RED, ANSI_RESET } from "../constants";
import { Request, Response, NextFunction } from "express";

const ctrl = new Produto.Ctrl();

export default {
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
        error: e,
        msg: `${ANSI_RED}Houve um erro ao inserir os dados disponibilizados no objeto. Contate o administrador do sistema caso precise de ajuda. Erro: ${ANSI_RESET}`
      })
    }

    res.status(200).json({
      msg: `${ANSI_GREEN}Você registrou ${ANSI_RESET}${ANSI_MAGENTA}${catOrCats}${ANSI_RESET}${ANSI_GREEN}no banco de dados.${ANSI_RESET}`
    });
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
        throw new Error("O nome fornecido não foi uma string. " + `(${typeof query.name})`);

      if (typeof params.cat !== 'string')
        throw new Error("A categoria fornecida não foi uma string. " + `(${typeof query.name})`);

      const name = query.name;
      const id = await ctrl.getCatId(params.cat, name);

      if (!id)
        throw new Error("Não foi encontrada nenhuma categoria com este nome");

      switch (params.cat) {
        case "Tipos": {
          destroyedRows = await Cat.TipoMdl.destroy({ where: { id: id } });
          break;
        }
        case "Grupos": {
          destroyedRows = await Cat.GrupoMdl.destroy({ where: { id: id } });
          break;
        }
        case "Marcas": {
          destroyedRows = await Cat.MarcaMdl.destroy({ where: { id: id } });
          break;
        }
        case "Modelos": {
          destroyedRows = await Cat.MdloMdl.destroy({ where: { id: id } });
          break;
        }
      }
    } catch (e) {
      return res.status(500).json({
        error: e,
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
        error: e,
        message: `${ANSI_RED}Ocorreu um erro ao tentar retornar as categorias especificadas.${ANSI_RESET}`
      })
    }
  },

  async get_cat_columns(req: Request, res: Response) {
    return res.json(ctrl.Model.getAttributes());
  },
}