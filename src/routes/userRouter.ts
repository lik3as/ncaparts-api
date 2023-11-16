import { Router } from 'express'

import services from '../services/userServices';
import util from '../middleware/util';

const router = Router()

router.post('/Clientes', util.verifyCommonJWT, services.create_many, services.create);
router.get('/Clientes/columns', util.verifyCommonJWT, services.get_columns);

/**
 * NEED AUTHORIZATION
 */
router.get('/Clientes', util.verifyMasterJWT, services.all);
router.delete('/Clientes', util.verifyMasterJWT, services.delete_instance);

export default router;