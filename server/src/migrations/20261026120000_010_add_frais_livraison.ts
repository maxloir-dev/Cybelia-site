import type { Knex } from "knex";

// Frais de livraison : chaque dimension porte son propre tarif d'envoi.
// Le total est calculé côté serveur (voir services/panierService.ts).

// Tarif appliqué à un article dont la dimension est inconnue ou absente.
// ⬇️ C'est ici qu'on modifie la valeur par défaut.
const FRAIS_PAR_DEFAUT = 5.9;

const TARIFS: { label: string; frais: number }[] = [
	{ label: "Carte postale (10,5 × 14,8 cm)", frais: 2.5 },
	{ label: "13 × 18 cm", frais: 4.9 },
	{ label: "21 × 30 cm", frais: 4.9 },
	{ label: "30 × 40 cm", frais: 5.9 },
	{ label: "50 × 70 cm", frais: 11.9 },
];

const MARQUE_PAGE = {
	label: "Marque-page (5 × 15 cm)",
	largeur_cm: 5.0,
	hauteur_cm: 15.0,
	frais_livraison: 2.5,
};

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("dimensions", (table) => {
		table.decimal("frais_livraison", 10, 2).notNullable().defaultTo(FRAIS_PAR_DEFAUT);
	});

	for (const tarif of TARIFS) {
		await knex("dimensions")
			.where({ label: tarif.label })
			.update({ frais_livraison: tarif.frais });
	}

	await knex("dimensions").insert(MARQUE_PAGE);

	// Frais réellement facturés, figés au moment de la commande (factures, litiges).
	// 0 pour les commandes passées avant la mise en place des frais.
	await knex.schema.alterTable("commandes", (table) => {
		table.decimal("frais_livraison", 10, 2).notNullable().defaultTo(0);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.dropColumn("frais_livraison");
	});

	await knex("dimensions").where({ label: MARQUE_PAGE.label }).del();

	await knex.schema.alterTable("dimensions", (table) => {
		table.dropColumn("frais_livraison");
	});
}
