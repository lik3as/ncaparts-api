import { Router } from 'express'
import ctrl_tables from '../controllers/ctrl.manager';

const router: Router = Router()

router.get('/tables', ctrl_tables.get_tables);
router.get('/:table', ctrl_tables.get_table);

export default router;