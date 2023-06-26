import { Router } from 'express'
import ctrl_tables from '../controllers/ctrl.manager';

const router: Router = Router()

router.get('/:table/Records', ctrl_tables.redirect);
router.get('/tables', ctrl_tables.get_tables);
router.get('/:table/columns', ctrl_tables.get_table_columns);
router.get('/:table', ctrl_tables.get_table);
router.post('/:table', ctrl_tables.post_table);

export default router;