import { Response } from "express";
import {
	createCommande,
	createLignesCommande,
	getAllCommandes,
	getCommandeById,
	getCommandesByUserId,
} from "../models/commandeModel";
import { getProduitById } from "../models/produitModel";
import { getProduitDimensionPrix, getAllDimensions } from "../models/dimensionModel";
import { AuthRequest } from "../middlewares/authMiddleware";

// Routes liées aux commandes

// Passer une nouvelle commande (client connecté)
// Le client envoie la liste des produits avec leurs quantités
export const passerCommande = async (req: AuthRequest, res: Response) => {
	try {
		const utilisateur_id = req.utilisateur!.id;
		const { lignes } = req.body;
		// lignes = [{ produit_id, quantite, dimension_id? }, ...]

		// Re-fetch les prix depuis la DB — jamais faire confiance au client
		const toutesLesDimensions = await getAllDimensions();

		const lignesVerifiees = await Promise.all(
			lignes.map(async (ligne: { produit_id: number; quantite: number; dimension_id?: number }) => {
				const produit = await getProduitById(ligne.produit_id);
				if (!produit) throw new Error(`Produit ${ligne.produit_id} introuvable`);

				let prix_unitaire = Number(produit.prix);
				let dimension_label: string | null = null;

				if (ligne.dimension_id) {
					const prixDimension = await getProduitDimensionPrix(ligne.produit_id, ligne.dimension_id);
					if (prixDimension === null) {
						throw new Error(`Dimension ${ligne.dimension_id} non disponible pour le produit ${ligne.produit_id}`);
					}
					prix_unitaire = Number(prixDimension);
					const dim = toutesLesDimensions.find((d) => d.id === ligne.dimension_id);
					dimension_label = dim?.label ?? null;
				}

				return {
					produit_id: ligne.produit_id,
					quantite: ligne.quantite,
					prix_unitaire,
					dimension_id: ligne.dimension_id ?? null,
					produit_nom: produit.nom,
					dimension_label,
				};
			}),
		);

		// Calcul du montant total avec les vrais prix
		const montant_total = lignesVerifiees.reduce(
			(total, ligne) => total + ligne.quantite * ligne.prix_unitaire,
			0,
		);

		const commande_id = await createCommande(utilisateur_id, montant_total);
		await createLignesCommande(commande_id, lignesVerifiees);

		res.status(201).json({ message: "Commande passée avec succès", commande_id });
	} catch (error) {
		res.status(500).json({ message: "Erreur lors de la création de la commande" });
	}
};

// Récupère toutes les commandes (gérante uniquement)
export const getCommandes = async (req: AuthRequest, res: Response) => {
	try {
		const commandes = await getAllCommandes();
		res.json(commandes);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération des commandes" });
	}
};

// Récupère le détail d'une commande par son id (gérante uniquement)
export const getCommande = async (req: AuthRequest, res: Response) => {
	try {
		const commande = await getCommandeById(Number(req.params.id));
		if (!commande.length) {
			res.status(404).json({ message: "Commande non trouvée" });
		} else {
			res.json(commande);
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de la commande" });
	}
};
// Récupère les commandes du client connecté
export const getMesCommandes = async (req: AuthRequest, res: Response) => {
	try {
		const commandes = await getCommandesByUserId(req.utilisateur!.id);
		res.json(commandes);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Erreur lors de la récupération de vos commandes" });
	}
};
