import { Router } from 'express'

import merchCtrl from '../controllers/merchController';
import authCtrl from '../controllers/authController';

const router = Router();

router.get('/Mercadorias', merchCtrl.getSome, merchCtrl.getMerch);
router.get('/Mercadorias/Columns', merchCtrl.get_columns);
router.get('/Mercadorias/records', merchCtrl.count);

/**
 * ONLY WITH AUTHORIZATION
 */
router.post('/Mercadorias', authCtrl.verifyMasterJWT, merchCtrl.create, merchCtrl.create_many);
router.delete('/Mercadorias', authCtrl.verifyMasterJWT, merchCtrl.delete);


export default router;