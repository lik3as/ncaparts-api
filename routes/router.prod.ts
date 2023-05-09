import { Router } from 'express'
import ctrlProd from '../controllers/ctrl.prod';

const router = Router()

router.get('/prod', ctrlProd.latest);
router.get('/prod/cat', ctrlProd.get_categorias);
router.post('/prod/cat', ctrlProd.create_categoria);

export default router;