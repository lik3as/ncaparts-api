import { Router } from 'express'

import authController from '../controllers/authController'

const router = Router();

router.post('/auth/User', authController.handleCookieRequest);

export default router;