// Types de l'application

// Produit
export interface Produit {
	id: number;
	nom: string;
	description: string;
	prix: number;
	image_url?: string;
	created_at: string;
	categorie_id: number;
	categorie?: string;
	actif: number;
	disponible: number;
	mockup_url?: string | null;
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

// Dimension de format
export interface Dimension {
	id: number;
	label: string;
	largeur_cm: number;
	hauteur_cm: number;
	prix: number;
}

// Ligne de commande
export interface LigneCommande {
	produit_id: number;
	quantite: number;
	prix_unitaire: number;
	dimension_id?: number | null;
	produit_nom?: string;
	dimension_label?: string | null;
	image_url?: string | null;
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
