import { Router } from "express";
import tableController from "../controllers/tableController";
const router = Router();

router.get("/", tableController.get_tables);

export default router;