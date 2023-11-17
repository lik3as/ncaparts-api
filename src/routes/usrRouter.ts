import { Router } from 'express'

import usrCtrl from '../controllers/userController';
import authCtrl from '../controllers/authController';

const router = Router()

router.post('/Clientes', authCtrl.verifyCommonJWT, usrCtrl.create_many, usrCtrl.create);
router.get('/Clientes/columns', authCtrl.verifyCommonJWT, usrCtrl.get_columns);

/**
 * NEED AUTHORIZATION
 */
router.get('/Clientes', authCtrl.verifyMasterJWT, usrCtrl.all);
router.delete('/Clientes', authCtrl.verifyMasterJWT, usrCtrl.delete_instance);

export default router;