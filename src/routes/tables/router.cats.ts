import { Router } from "express";
import prodCtrl from "../../controllers/prodCtrl";
const router = Router();

router.get("/Categorias/:cat", prodCtrl.get_categorias);
router.post("/Categorias/:cat", prodCtrl.create_categoria);

export default router;