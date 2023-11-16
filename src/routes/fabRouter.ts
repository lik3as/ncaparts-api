import { Router } from "express";
import services from '../services/fabServices'
const router = Router();

router.get("/Fabricantes", services.getModels);
router.post("/Fabricantes", services.createMany, services.updateMany);

/**
 * NEEDS AUTHORIZATION
 */
router.delete("/Fabricantes", services.delete_instance);
export default router