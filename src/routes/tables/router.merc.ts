import { Router } from 'express'

import ctrlMerc from '../../controllers/ctrl.merc';
import util from '../../middleware/util';

const router = Router();

router.post('/tables/Mercadorias', util.verifyMasterJWT, ctrlMerc.create, ctrlMerc.create_many, ctrlMerc.update);
router.get('/tables/Mercadorias', ctrlMerc.get_mercs, ctrlMerc.get_mercs_with_sku, ctrlMerc.get_sugestions);
router.get('/tables/Mercadorias/Columns', ctrlMerc.get_columns);
router.get('/tables/Mercadorias/records', ctrlMerc.count);

export default router;