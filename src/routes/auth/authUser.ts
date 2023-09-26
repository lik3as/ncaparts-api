import { Router } from 'express'

import middlewares from '../../controllers/authCtrl'

const router = Router();

router.post('/auth/User', middlewares.handleCookieRequest);

export default router;