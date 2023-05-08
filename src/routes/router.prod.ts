import { Router } from 'express'
import ctrlProd from '../controllers/ctrl.prod';

const router = Router()

router.get('/prod', ctrlProd.latest);

export default router;