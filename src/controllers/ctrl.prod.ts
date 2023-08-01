import { sProd } from 'ncaparts-db'
import { Request, Response, NextFunction } from "express";

const ctrl = new sProd();
const skeleton  = new sProd.skeleton();

type Produto = typeof skeleton ;

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

    const prod = (await ctrl.getBody({method: 'find_by_',
     on: 'unique', args: sku}))!;

    res.json(prod);
  },

  async create_many(req: Request, res: Response, next: NextFunction) {
    const query = req.query;
    if (query.a == "update") {
      return next();
    }

    let bodies: Object[] = req.body;
    let created: Produto[] = [];

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
        if (creation != undefined) created?.push(creation);
      }
    }

    return res.send(`\x1b[32mVocê registrou um total de \x1b[0m\x1b[35m${created.length} \x1b[32mprodutos no banco de dados\x1b[0m` +
      '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m de categorias no arquivo.\x1b[0m');
  },

  async update(req: Request, res: Response, next: NextFunction) {
    let bodies: Object[] = req.body;
    let updateds: Produto[] = [];

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


      if (body != null) {
        const updated = await ctrl.update(body).catch(on_error);
        if (updated != null && typeof updated !=='undefined') updateds?.push(prod);
      }
    }

    return res.send(`\x1b[32mVocê atualizou um total de \x1b[0m\x1b[35m${updateds.length} \x1b[32mno banco de dados\x1b[0m` +
      '\n\x1b[32mHaviam \x1b[0m\x1b[35m' + req.body.length + '\x1b[0m\x1b[32m de categorias no arquivo.\x1b[0m');
    
  },

  async create_categoria(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (Array.isArray(body)){

      body.forEach((cat) => {
        cat.nome = (cat.nome as string).toUpperCase();
      })

      let created = await ctrl.createCategoria(req.params.cat, body).catch(on_error)
      if (created == undefined) created = [];

      return res.send(`\x1b[32mVocê registrou um total de \x1b[0m\x1b[35m${(created  as []).length} \x1b[32mno banco de dados\x1b[0m` +
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
