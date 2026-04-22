import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import multer from "multer";

// Multer — stockage en mémoire avant envoi à Cloudinary

const storage = multer.memoryStorage();

const fileFilter = (
	req: any,
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

// Upload une image vers Cloudinary

export const uploadImage = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			res.status(400).json({ message: "Aucune image fournie" });
			return;
		}

		// Conversion du buffer en base64
		const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

		// Envoi à Cloudinary
		const result = await cloudinary.uploader.upload(base64, {
			folder: "cybelia", // Dossier dans Cloudinary
			transformation: [
				{ quality: "auto" }, // Compression automatique
				{ fetch_format: "auto" }, // Format optimal selon le navigateur
			],
		});

		// On retourne l'URL de l'image
		res.json({ url: result.secure_url });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
	}
};
