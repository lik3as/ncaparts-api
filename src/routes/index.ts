import { Router } from "express";
import index from "../controllers/indexCtrl";
const router = Router();

router.get("/", index.get_tables);

export default router;