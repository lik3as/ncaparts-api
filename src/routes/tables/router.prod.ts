import { Router } from 'express'
import ctrlProd from '../../controllers/prodCtrl';
import util from '../../middleware/util';

const router = Router()

router.post('/Produtos', util.verifyMasterJWT, ctrlProd.create_many, ctrlProd.update);
router.post('/Produtos/:cat', util.verifyMasterJWT, ctrlProd.create_categoria);
router.get('/Produtos/records', ctrlProd.count);
router.get('/Produtos', util.verifyMasterJWT,  ctrlProd.latest, ctrlProd.getOne);
router.get('/Produtos/columns', ctrlProd.get_columns);
router.get('/Produtos/:cat', ctrlProd.get_categorias);
router.get('/Produtos/:cat/columns', ctrlProd.get_cat_columns);

export default router;