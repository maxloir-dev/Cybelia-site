import { Router } from "express";
import { getDimensions } from "../controllers/dimensionController";

const router = Router();

// GET /api/dimensions — référentiel complet des formats (public)
router.get("/", getDimensions);

export default router;
