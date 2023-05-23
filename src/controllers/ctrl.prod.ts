import { sProd, sequelize } from 'ncaparts-db'
import { Request, Response, NextFunction } from "express";

const ctrl = new sProd();
const _prod  = new sProd.skeleton();
type prod = typeof _prod | void;

const on_error = (err: any) => {
  console.log('An error occured while trying to access Products route: \n' + 
  `\x1b[31m${err}\x1b[0m`)
}

function uppercase(txt: string | undefined): null | string {
  if (typeof txt === 'undefined'){
    return null;
  }
  return txt.toUpperCase();
}

export default {

  /**
   * @returns Fifty latest products ordered by name 
   */
  async latest(req: Request, res: Response) {
    return res.json(await ctrl.getAllBodies().catch(on_error))
  },

  async create(req: Request, res: Response, next: NextFunction) {

    let bodies: Object[] = req.body;
    let created: prod[] = [];

    //De nome para id, pronto para a inserção
    for (let i: number = 0 ; i < bodies.length; i++){
      let body = bodies[i];
      const prod = body as any;  


      if (typeof (prod.imagens) !== 'undefined') 
      prod.imagens = (prod.imagens as string).split(',');
      else prod.imagens = [];

      prod.tipo = uppercase(prod.tipo);
      prod.subtipo = uppercase(prod.subtipo);
      prod.marca = uppercase(prod.marca);
      prod.modelo = uppercase(prod.modelo);
      prod.versao = uppercase(prod.versao)

      prod.id_tipo = (await ctrl.getCatId('Tipos', prod.tipo));
      prod.id_subtipo = (await ctrl.getCatId('Subtipo', prod.subtipo));
      prod.id_marca = (await ctrl.getCatId('Marca', prod.marca));
      prod.id_modelo = (await ctrl.getCatId('Modelo', prod.modelo));
      prod.id_versao = (await ctrl.getCatId('Versao', prod.versao));
      prod.id_prodSku = (await ctrl.getId(prod.prodSku as string));


      if (req.query.b == 'bulk') body = await ctrl.filterUniques(prod) as {};


      if (body != null) {
        const creation = await ctrl.createOne(body).catch(on_error);
        created?.push(creation);
      }
    }

      return res.send(`\x1b[32mVocê registrou um total de \x1b[0m\x1b[35m${created.length} \x1b[32mno banco de dados\x1b[0m` +
    '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m de categorias no arquivo.\x1b[0m');
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (Array.isArray(body)){

      body.forEach((cat) => {
        cat.nome = (cat.nome as string).toUpperCase();
      })

      await ctrl.createCategoria(req.params.cat, body).catch(on_error)
      return res.send(`\x1b[32mVocê registrou um total de \x1b[0m\x1b[35m${body.length} \x1b[32mno banco de dados\x1b[0m` +
      '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m produtos no arquivo.\x1b[0m');
    }

    body.nome = (body.nome as string).toUpperCase();
    await ctrl.createCategoria(req.params.cat, body).catch(on_error)
    return res.send(`\x1b[32mVocê registrou \x1b[0m\x1b[35m${body} \x1b[0m\x1b[32mno banco de dados.\x1b[0m`);

  },

  async get_categorias(req: Request, res: Response) {
    return res.json(await ctrl.getCats(req.params.cat).catch(on_error));
  },

  async get_cat_columns(req: Request, res: Response) {
    return res.json(sProd.tipoSkeleton.getAttributes());
  },

  async get_columns(req: Request, res: Response) {
    return res.json(sProd.skeleton.getAttributes())
  }
}