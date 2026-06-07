import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	// Snapshot nom produit + label dimension dans les lignes de commande
	await knex.schema.alterTable("lignes_commande", (table) => {
		table.string("produit_nom", 100).nullable();
		table.string("dimension_label", 100).nullable();
	});

	// Statut de suivi sur les commandes
	await knex.schema.alterTable("commandes", (table) => {
		table
			.enum("statut", ["en_attente", "en_preparation", "expediee", "livree"])
			.notNullable()
			.defaultTo("en_attente");
	});

	// Disponibilité produit (distinct du soft delete actif)
	await knex.schema.alterTable("produits", (table) => {
		table.boolean("disponible").notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("lignes_commande", (table) => {
		table.dropColumn("produit_nom");
		table.dropColumn("dimension_label");
	});
	await knex.schema.alterTable("commandes", (table) => {
		table.dropColumn("statut");
	});
	await knex.schema.alterTable("produits", (table) => {
		table.dropColumn("disponible");
	});
}
