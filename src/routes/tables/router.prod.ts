import { Router } from 'express';
import ctrlProd from '../../controllers/prodCtrl';
import util from '../../middleware/util';

const router = Router();

router.get('/Produtos/records', ctrlProd.count);
router.get('/Produtos/columns', ctrlProd.get_columns);

/**
 * ONLY WITH AUTHORIZATION
 */

router.get('/Produtos', util.verifyMasterJWT, ctrlProd.getOne); /** RETURN ALL PRODUCTS */
router.get('/Produtos/:sku', util.verifyMasterJWT, ctrlProd.getProducts); /** RETURN ONE PRODUCT */

router.post('/Produtos', util.verifyMasterJWT, ctrlProd.create_many); /** CREATE MULTIPLE PRODUCTS */
router.post('/Produtos', util.verifyMasterJWT, ctrlProd.update) /** UPDATE MANY PRODUCTS */

router.patch('/Produtos/:sku', util.verifyMasterJWT, ctrlProd.updateSingle) /** PATCH ONE PRODUCT */
router.delete('/Produtos/:sku', util.verifyCommonJWT, ctrlProd.delete_produto); /** DELETE ONE PRODUCT */

router.put('/Produtos', util.verifyMasterJWT, ctrlProd.replaceAll); /** REPLACE */
router.put('/Produtos/:sku', util.verifyMasterJWT, ctrlProd.replace); /** CREATE / REPLACE */

/**
 * TEMP DOCS
 * YOU CAN'T DELETE ALL THE PRODUCTS AT ONCE
 * IF THAT'S REALLY THE CASE, YOU CAN USE PUT TO PUT NEW PRODUCTS, OVERRIDING THE RESOURCES
 */
export default router;