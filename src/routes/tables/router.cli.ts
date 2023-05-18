import { Router } from 'express'
import ctrl_cli from '../../controllers/ctrl.cli';

const router = Router()

router.post('/tables/Clientes', ctrl_cli.create_many, ctrl_cli.create_one);
router.get('/tables/Clientes', ctrl_cli.all);
router.get('/tables/Clientes/columns', ctrl_cli.get_columns);

export default router;