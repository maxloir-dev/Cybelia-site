// Insère des transformations Cloudinary (format auto, qualité auto, largeur)
// dans une URL d'image déjà hébergée sur Cloudinary.
// Doc : https://cloudinary.com/documentation/transformation_reference
export function cloudinaryUrl(
	url: string | null | undefined,
	width?: number,
): string | undefined {
	if (!url) return undefined;

	const marker = "/upload/";
	const index = url.indexOf(marker);
	if (index === -1) return url; // pas une URL Cloudinary reconnue, on ne touche pas

	const transformations = ["f_auto", "q_auto", width ? `w_${width}` : null]
		.filter(Boolean)
		.join(",");

	const insertAt = index + marker.length;
	return `${url.slice(0, insertAt)}${transformations}/${url.slice(insertAt)}`;
}
