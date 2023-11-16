import { Router } from "express";
import index from "../services/indexServices";
const router = Router();

router.get("/", index.get_tables);

export default router;