import { Router } from "express";
import { envoyerContact } from "../controllers/contactController";

const router = Router();

router.post("/", envoyerContact);

export default router;
