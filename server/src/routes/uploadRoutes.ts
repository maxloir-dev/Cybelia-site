import { Router } from "express";
import { uploadMultipleImages, upload } from "../controllers/uploadController";
import { verifierToken, verifierAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Route upload 2 images (principale + mockup)
router.post(
	"/multiple",
	// verifierToken,
	// verifierAdmin,
	(req, res, next) => {
		upload.array("images", 2)(req, res, (err: any) => {
			if (err) {
				res.status(400).json({ message: err.message });
				return;
			}
			next();
		});
	},
	uploadMultipleImages,
);

export default router;
