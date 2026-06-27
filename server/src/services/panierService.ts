import { getProduitById } from "../models/produitModel";
import {
	getAllDimensions,
	getProduitDimensionPrix,
} from "../models/dimensionModel";

// Une ligne telle qu'envoyée par le client (NON fiable : prix volontairement absent)
export interface LignePanier {
	produit_id: number;
	quantite: number;
	dimension_id?: number | null;
}

// Une ligne dont le prix a été re-calculé depuis la base de données
export interface LigneVerifiee {
	produit_id: number;
	quantite: number;
	prix_unitaire: number;
	dimension_id: number | null;
	produit_nom: string;
	dimension_label: string | null;
}

export interface PanierVerifie {
	lignesVerifiees: LigneVerifiee[];
	montant_total: number; // en euros
}

// Recalcule prix et montant total UNIQUEMENT à partir de la base de données.
// On ne fait jamais confiance aux prix envoyés par le client : c'est le point
// de sécurité central avant tout paiement réel.
export const calculerPanier = async (
	lignes: LignePanier[],
): Promise<PanierVerifie> => {
	if (!Array.isArray(lignes) || lignes.length === 0) {
		throw new Error("Panier vide ou invalide");
	}

	const toutesLesDimensions = await getAllDimensions();

	const lignesVerifiees: LigneVerifiee[] = await Promise.all(
		lignes.map(async (ligne) => {
			const quantite = Number(ligne.quantite);
			if (!Number.isInteger(quantite) || quantite <= 0) {
				throw new Error(`Quantité invalide pour le produit ${ligne.produit_id}`);
			}

			const produit = await getProduitById(ligne.produit_id);
			if (!produit) throw new Error(`Produit ${ligne.produit_id} introuvable`);

			let prix_unitaire = Number(produit.prix);
			let dimension_label: string | null = null;

			if (ligne.dimension_id) {
				const prixDimension = await getProduitDimensionPrix(
					ligne.produit_id,
					ligne.dimension_id,
				);
				if (prixDimension === null) {
					throw new Error(
						`Dimension ${ligne.dimension_id} non disponible pour le produit ${ligne.produit_id}`,
					);
				}
				prix_unitaire = Number(prixDimension);
				const dim = toutesLesDimensions.find((d) => d.id === ligne.dimension_id);
				dimension_label = dim?.label ?? null;
			}

			return {
				produit_id: ligne.produit_id,
				quantite,
				prix_unitaire,
				dimension_id: ligne.dimension_id ?? null,
				produit_nom: produit.nom,
				dimension_label,
			};
		}),
	);

	const montant_total = lignesVerifiees.reduce(
		(total, ligne) => total + ligne.quantite * ligne.prix_unitaire,
		0,
	);

	return { lignesVerifiees, montant_total };
};
