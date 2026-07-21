// Échappe les caractères HTML spéciaux pour éviter l'injection dans un template HTML
export const escapeHtml = (str: string) =>
	str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
