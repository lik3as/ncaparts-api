import { Router } from "express";
import fabController from '../controllers/fabController'
const router = Router();

router.get("/Fabricantes", fabController.getSome);
router.post("/Fabricantes", fabController.createMany, fabController.updateMany);

/**
 * NEEDS AUTHORIZATION
 */
router.delete("/Fabricantes", fabController.delete);
export default router