import { Router } from 'express'
import ctrl_cli from '../controllers/ctrl.cli';

const router = Router()

router.post('/cli', ctrl_cli.create);
router.get('/cli', ctrl_cli.all);

export default router;