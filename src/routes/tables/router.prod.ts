import { Router } from 'express'
import ctrlProd from '../../controllers/ctrl.prod';
import util from '../../middleware/util';

const router = Router()

router.post('/tables/Produtos', util.verifyMasterJWT, ctrlProd.create_many, ctrlProd.update);
router.post('/tables/Produtos/:cat', util.verifyMasterJWT, ctrlProd.create_categoria);
router.get('/tables/Produtos/records', ctrlProd.count);
router.get('/tables/Produtos', util.verifyMasterJWT,  ctrlProd.latest, ctrlProd.getOne);
router.get('/tables/Produtos/columns', ctrlProd.get_columns);
router.get('/tables/Produtos/:cat', ctrlProd.get_categorias);
router.get('/tables/Produtos/:cat/columns', ctrlProd.get_cat_columns);

export default router;