import { Router } from 'express'

import ctrlUser from '../../controllers/userCtrl';
import util from '../../middleware/util';

const router = Router()

router.post('/tables/Clientes', util.verifyCommonJWT, ctrlUser.create_many, ctrlUser.create);
router.get('/tables/Clientes', util.verifyMasterJWT, ctrlUser.all);
router.get('/tables/Clientes/columns', util.verifyCommonJWT, ctrlUser.get_columns);

export default router;