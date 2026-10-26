import { getProduitById } from "../models/produitModel";
import {
	getAllDimensions,
	getProduitDimensionPrix,
} from "../models/dimensionModel";

// ─── Frais de livraison ─────────────────────────────────────────
// Un forfait couvre jusqu'à 3 articles d'une même dimension ; le 4e article
// déclenche un second forfait. Deux dimensions différentes s'additionnent,
// car chaque format part dans son propre emballage.
const ARTICLES_PAR_FORFAIT = 3;

// Tarifs utilisés quand l'article n'a pas de dimension : les dimensions ne
// concernent que les affiches.
// ⬇️ C'est ici qu'on modifie ces valeurs.
const FRAIS_PAR_DEFAUT = 5.9;
const FRAIS_PAR_CATEGORIE: Record<string, number> = {
	"Carte postale": 2.5,
};

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
	sous_total: number; // articles seuls, en euros
	frais_livraison: number; // en euros
	montant_total: number; // sous_total + frais_livraison, en euros
}

// Ce qui sert au calcul des frais, sans alourdir LigneVerifiee
interface LigneAvecLivraison {
	ligne: LigneVerifiee;
	groupe: string; // articles partageant le même emballage
	forfait: number; // tarif d'un envoi pour ce groupe
}

const arrondir = (montant: number): number => Math.round(montant * 100) / 100;

// Additionne un forfait par tranche de 3 articles, pour chaque groupe.
const calculerFraisLivraison = (details: LigneAvecLivraison[]): number => {
	const groupes = new Map<string, { quantite: number; forfait: number }>();

	for (const detail of details) {
		const cumul = groupes.get(detail.groupe);
		groupes.set(detail.groupe, {
			quantite: (cumul?.quantite ?? 0) + detail.ligne.quantite,
			forfait: detail.forfait,
		});
	}

	let frais = 0;
	for (const groupe of groupes.values()) {
		frais += Math.ceil(groupe.quantite / ARTICLES_PAR_FORFAIT) * groupe.forfait;
	}

	return arrondir(frais);
};

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

	const details: LigneAvecLivraison[] = await Promise.all(
		lignes.map(async (ligne) => {
			const quantite = Number(ligne.quantite);
			if (!Number.isInteger(quantite) || quantite <= 0) {
				throw new Error(`Quantité invalide pour le produit ${ligne.produit_id}`);
			}

			const produit = await getProduitById(ligne.produit_id);
			if (!produit) throw new Error(`Produit ${ligne.produit_id} introuvable`);

			let prix_unitaire = Number(produit.prix);
			let dimension_label: string | null = null;

			// Sans dimension, le tarif dépend de la catégorie du produit
			let groupe = `categorie:${produit.categorie}`;
			let forfait = FRAIS_PAR_CATEGORIE[produit.categorie] ?? FRAIS_PAR_DEFAUT;

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

				groupe = `dimension:${ligne.dimension_id}`;
				if (dim) forfait = Number(dim.frais_livraison);
			}

			return {
				ligne: {
					produit_id: ligne.produit_id,
					quantite,
					prix_unitaire,
					dimension_id: ligne.dimension_id ?? null,
					produit_nom: produit.nom,
					dimension_label,
				},
				groupe,
				forfait,
			};
		}),
	);

	const lignesVerifiees = details.map((detail) => detail.ligne);

	const sous_total = arrondir(
		lignesVerifiees.reduce(
			(total, ligne) => total + ligne.quantite * ligne.prix_unitaire,
			0,
		),
	);

	const frais_livraison = calculerFraisLivraison(details);

	return {
		lignesVerifiees,
		sous_total,
		frais_livraison,
		montant_total: arrondir(sous_total + frais_livraison),
	};
};
