import { Router } from 'express'

import middlewares from '../../controllers/auth/authUser'

const router = Router();

router.post('/auth/User', middlewares.handleCookieRequest);

export default router;