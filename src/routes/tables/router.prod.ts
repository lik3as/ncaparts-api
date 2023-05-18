import { Router } from 'express'
import ctrlProd from '../../controllers/ctrl.prod';

const router = Router()

router.post('/tables/Produtos', ctrlProd.create);
router.get('/tables/Produtos', ctrlProd.latest);
router.get('/tables/Produtos/columns', ctrlProd.get_columns);
router.get('/tables/Produtos/:cat', ctrlProd.get_categorias);

export default router;