import { Router } from 'express'

import services from '../services/mercServices';
import util from '../middleware/util';

const router = Router();

router.get('/Mercadorias', services.get_mercs, services.get_mercs_with_sku);
router.get('/Mercadorias/related', services.get_related);
router.get('/Mercadorias/Columns', services.get_columns);
router.get('/Mercadorias/records', services.count);

/**
 * ONLY WITH AUTHORIZATION
 */
router.post('/Mercadorias', util.verifyMasterJWT, services.create, services.create_many, services.update);
router.delete('/Mercadorias', util.verifyMasterJWT, services.delete_instance);


export default router;