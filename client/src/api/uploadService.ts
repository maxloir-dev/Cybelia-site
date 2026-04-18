import api from "./axios";

// Upload d'une image vers Cloudinary

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append("image", file);

	const response = await api.post("/upload", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	// Retourne l'URL de l'image sur Cloudinary
	return response.data.url;
};
