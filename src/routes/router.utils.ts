import { Router } from 'express'
import ctrl_tables from '../controllers/ctrl.tables';

const router: Router = Router()

router.get('/tables', ctrl_tables.get_tables);

export default router;