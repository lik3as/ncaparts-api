import { Router } from "express";
import catController from "../controllers/catController";
import authController from "../controllers/authController";
const router = Router();

router.get("/Categorias/:cat", catController.getCategorias);
router.get("/Categorias/:cat/columns", catController.getCategoriaColumns);

router.delete("/Categorias/:cat", authController.verifyMasterJWT, catController.delete); 

/** missing implemetation for createMany */
router.post("/Categorias/:cat", authController.verifyMasterJWT, catController.create, catController.createMany);

export default router;