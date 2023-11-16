import { Router } from 'express';
import services from '../services/prodServices';
import util from '../middleware/util';

const router = Router();

router.get('/Produtos/records', services.count);
router.get('/Produtos/columns', services.get_columns);

/**
 * ONLY WITH AUTHORIZATION
 */

router.get('/Produtos', util.verifyMasterJWT, services.getOne); /** RETURN ALL PRODUCTS */
router.get('/Produtos/:UUID', util.verifyMasterJWT, services.getProducts); /** RETURN ONE PRODUCT */

router.post('/Produtos', util.verifyMasterJWT, services.create_many); /** CREATE MULTIPLE PRODUCTS */

router.delete('/Produtos/:UUID', util.verifyCommonJWT, services.delete_produto); /** DELETE ONE PRODUCT */

router.put('/Produtos', util.verifyMasterJWT, services.replaceAll); /** REPLACE */

/**
 * TEMP DOCS
 * YOU CAN'T DELETE ALL THE PRODUCTS AT ONCE
 * IF THAT'S REALLY THE CASE, YOU CAN USE PUT TO PUT NEW PRODUCTS, OVERRIDING THE RESOURCES
 */
export default router;