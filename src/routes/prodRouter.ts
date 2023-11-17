import { Router } from 'express';
import prodCtrl from '../controllers/prodController';
import authCtrl from '../controllers/authController';

const router = Router();

router.get('/Produtos/records', prodCtrl.count);
router.get('/Produtos/columns', prodCtrl.get_columns);

/**
 * ONLY WITH AUTHORIZATION
 */

router.get('/Produtos/:UUID', authCtrl.verifyMasterJWT, prodCtrl.getOne); /** RETURN ONE PRODUCT */
router.get('/Produtos', authCtrl.verifyMasterJWT, prodCtrl.getSome); /** RETURN SOME PRODUCTS */

router.post('/Produtos', authCtrl.verifyMasterJWT, prodCtrl.createMany); /** CREATE MULTIPLE PRODUCTS */

router.delete('/Produtos/:UUID', authCtrl.verifyCommonJWT, prodCtrl.delete); /** DELETE ONE PRODUCT */

router.put('/Produtos', authCtrl.verifyMasterJWT, prodCtrl.replaceAll); /** REPLACE */

/**
 * TEMP DOCS
 * YOU CAN'T DELETE ALL THE PRODUCTS AT ONCE
 * IF THAT'S REALLY THE CASE, YOU CAN USE PUT TO PUT NEW PRODUCTS, OVERRIDING THE RESOURCES
 */
export default router;