import { Router } from "express";
import catsCtrl from "../../controllers/catsCtrl";
import util from "../../middleware/util";
const router = Router();

router.get("/Categorias/:cat", catsCtrl.get_categorias);
router.get("/Categorias/:cat/columns", catsCtrl.get_cat_columns);

router.delete("/Categorias/:cat", util.verifyMasterJWT, catsCtrl.delete_cat); 
router.post("/Categorias/:cat", util.verifyMasterJWT, catsCtrl.create_categoria);

export default router;