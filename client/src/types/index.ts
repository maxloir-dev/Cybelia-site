// Types de l'application

// Produit
export interface Produit {
	id: number;
	nom: string;
	description: string;
	prix: number;
	image_url: string;
	created_at: string;
	categorie: string;
}

// Categorie
export interface Categorie {
	id: number;
	nom: string;
}

// Utilisateur
export interface Utilisateur {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	role_id: number;
	created_at: string;
}

// Ligne de commande
export interface LigneCommande {
	produit_id: number;
	quantite: number;
	prix_unitaire: number;
	produit_nom?: string;
}

// Commande
export interface Commande {
	id: number;
	montant_total: number;
	created_at: string;
	nom?: string;
	prenom?: string;
	email?: string;
	lignes?: LigneCommande[];
}

// Panier
export interface PanierItem {
	produit: Produit;
	quantite: number;
}
