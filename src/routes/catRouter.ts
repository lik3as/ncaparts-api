import { Router } from "express";
import services from "../services/catServices";
import util from "../middleware/util";
const router = Router();

router.get("/Categorias/:cat", services.get_categorias);
router.get("/Categorias/:cat/columns", services.get_cat_columns);

router.delete("/Categorias/:cat", util.verifyMasterJWT, services.delete_cat); 
router.post("/Categorias/:cat", util.verifyMasterJWT, services.create_categoria);

export default router;