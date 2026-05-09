import api from "./axios";

// ============================================
// Upload d'images vers Cloudinary
// ============================================
export const uploadImage = async (
	file: File,
	mockup?: File,
): Promise<{ image_url: string; mockup_url: string | null }> => {
	const formData = new FormData();
	formData.append("images", file);
	if (mockup) formData.append("images", mockup);

	const response = await api.post("/upload/multiple", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};
