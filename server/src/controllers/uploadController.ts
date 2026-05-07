import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import multer from "multer";

// Multer — stockage en mémoire avant envoi à Cloudinary

const storage = multer.memoryStorage();

const fileFilter = (
	_req: any,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	const typesAcceptes = ["image/jpeg", "image/png", "image/webp"];
	if (typesAcceptes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Format non accepté — utilisez JPG, PNG ou WEBP"));
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const uploadVersCloudinary = async (file: Express.Multer.File): Promise<string> => {
	const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
	const result = await cloudinary.uploader.upload(base64, {
		folder: "cybelia",
		transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
	});
	return result.secure_url;
};

// Upload jusqu'à 2 images (image principale + mockup)
export const uploadMultipleImages = async (req: Request, res: Response) => {
	try {
		const files = req.files as Express.Multer.File[];
		if (!files || files.length === 0) {
			res.status(400).json({ message: "Aucune image fournie" });
			return;
		}
		const urls = await Promise.all(files.map(uploadVersCloudinary));
		res.json({
			image_url: urls[0] ?? null,
			mockup_url: urls[1] ?? null,
		});
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de l'upload des images" });
	}
};
