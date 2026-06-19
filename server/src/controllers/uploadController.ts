import type { Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import sharp from "sharp";

// Multer — stockage en mémoire avant envoi à Cloudinary

const storage = multer.memoryStorage();

const fileFilter = (
	_req: Request,
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
	limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

const uploadVersCloudinary = async (
    file: Express.Multer.File,
): Promise<string> => {
    // Compression avant envoi à Cloudinary
    const buffer = await sharp(file.buffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    const base64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64, {
        folder: "cybelia",
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
        console.error("ERREUR UPLOAD:", error);
		res.status(500).json({ message: "Erreur lors de l'upload des images" });
	}
};
