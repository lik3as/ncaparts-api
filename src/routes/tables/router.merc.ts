import { Router } from 'express'
import ctrlMerc from '../../controllers/ctrl.merc';
const router = Router();

router.post('/tables/Mercadorias', ctrlMerc.create, ctrlMerc.create_many, ctrlMerc.update);
router.get('/tables/Mercadorias', ctrlMerc.get_fifty, ctrlMerc.get_mercs_with_sku, ctrlMerc.get_related_by_sku, ctrlMerc.get_related_by_name);
router.get('/tables/Mercadorias/Columns', ctrlMerc.get_columns);
router.get('/tables/Mercadorias/records', ctrlMerc.count);

export default router;