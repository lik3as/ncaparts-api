import { Router } from 'express'
import ctrlProd from '../../controllers/ctrl.prod';

const router = Router()

router.post('/tables/Produtos', ctrlProd.create);
router.post('/tables/Produtos/:cat', ctrlProd.create_categoria);
router.get('/tables/Produtos', ctrlProd.latest);
router.get('/tables/Produtos/columns', ctrlProd.get_columns);
router.get('/tables/Produtos/:cat', ctrlProd.get_categorias);
router.get('/tables/Produtos/:cat/columns', ctrlProd.get_cat_columns);

export default router;