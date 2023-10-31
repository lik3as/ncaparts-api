import { Router } from "express";
import ctrl from '../../controllers/fabCtrl'
const router = Router();

router.get("/Fabricantes", ctrl.getModels);
router.post("/Fabricantes", ctrl.createMany, ctrl.updateMany);

/**
 * NEEDS AUTHORIZATION
 */
router.delete("/Fabricantes", ctrl.delete_instance);
export default router