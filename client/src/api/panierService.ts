import api from "./axios";

export interface LignePanierApi {
	produit_id: number;
	quantite: number;
	dimension_id?: number | null;
}

export interface EstimationPanier {
	sous_total: number;
	frais_livraison: number;
	montant_total: number;
}

// Montants recalculés par le serveur : le front n'applique aucun barème
// de livraison lui-même, c'est la base de données qui fait foi.
export const estimerPanier = async (
	lignes: LignePanierApi[],
): Promise<EstimationPanier> => {
	const response = await api.post("/panier/estimation", { lignes });
	return response.data;
};
