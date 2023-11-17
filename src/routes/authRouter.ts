import { Router } from 'express'

import authController from '../controllers/authController'

const router = Router();

router.post('/auth/User', authController.sendToken);

export default router;