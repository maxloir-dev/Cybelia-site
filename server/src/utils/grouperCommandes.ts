// Regroupe les lignes d'un résultat de jointure commandes/lignes_commande
// (une ligne SQL par article) en un tableau de commandes avec leurs lignes imbriquées

export const grouperLignesParCommande = (rows: any[], champsLigne: string[]) => {
	const commandes = new Map<number, any>();

	for (const row of rows) {
		if (!commandes.has(row.id)) {
			const commande: any = { lignes: [] };
			for (const [cle, valeur] of Object.entries(row)) {
				if (!champsLigne.includes(cle)) commande[cle] = valeur;
			}
			commandes.set(row.id, commande);
		}

		const ligne: any = {};
		for (const champ of champsLigne) ligne[champ] = row[champ];
		commandes.get(row.id).lignes.push(ligne);
	}

	return [...commandes.values()];
};
