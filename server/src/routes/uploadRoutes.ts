import { Router } from "express";
import { uploadImage, upload } from "../controllers/uploadController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Route d'upload d'image (gérante uniquement)

router.post(
	"/",
	verifierToken,
	verifierAdmin,
	(req, res, next) => {
		upload.single("image")(req, res, (err: any) => {
			if (err) {
				res.status(400).json({ message: err.message });
				return;
			}
			next();
		});
	},
	uploadImage,
);

export default router;
