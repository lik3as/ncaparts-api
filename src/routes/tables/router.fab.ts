import { Router } from "express";
import ctrl from '../../controllers/fabCtrl'
const router = Router();

router.get("/Fabricantes", ctrl.getModels);
router.post("/Fabricantes", ctrl.createMany, ctrl.updateMany);

export default router