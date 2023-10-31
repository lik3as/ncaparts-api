import { Router } from 'express'

import ctrlUser from '../../controllers/userCtrl';
import util from '../../middleware/util';

const router = Router()

router.post('/Clientes', util.verifyCommonJWT, ctrlUser.create_many, ctrlUser.create);
router.get('/Clientes/columns', util.verifyCommonJWT, ctrlUser.get_columns);

/**
 * NEED AUTHORIZATION
 */
router.get('/Clientes', util.verifyMasterJWT, ctrlUser.all);
router.delete('/Clientes', util.verifyMasterJWT, ctrlUser.delete_instance);

export default router;