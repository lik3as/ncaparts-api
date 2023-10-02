import { Router } from "express";
import prodCtrl from "../../controllers/prodCtrl";
const router = Router();

router.get("/Cats/:cat", prodCtrl.get_categorias);
router.post("/Cats/:cat", prodCtrl.create_categoria);

export default router;