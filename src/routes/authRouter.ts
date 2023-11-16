import { Router } from 'express'

import middlewares from '../services/authServices'

const router = Router();

router.post('/auth/User', middlewares.handleCookieRequest);

export default router;