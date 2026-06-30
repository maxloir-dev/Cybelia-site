import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	// Table des formats standards
	await knex.schema.createTable("dimensions", (table) => {
		table.increments("id").primary();
		table.string("label", 100).notNullable();
		table.decimal("largeur_cm", 6, 1).notNullable();
		table.decimal("hauteur_cm", 6, 1).notNullable();
	});

	// Table de liaison produit ↔ dimension avec prix personnalisé
	// produit_id : int unsigned pour correspondre à produits.id (increments = unsigned)
	// dimension_id : int unsigned pour correspondre à dimensions.id créé ci-dessus
	await knex.schema.createTable("produit_dimensions", (table) => {
		table.increments("id").primary();
		table.integer("produit_id").unsigned().notNullable();
		table.integer("dimension_id").unsigned().notNullable();
		table.decimal("prix", 10, 2).notNullable();
		table.unique(["produit_id", "dimension_id"]);
		table.foreign("produit_id").references("produits.id").onDelete("CASCADE");
		table.foreign("dimension_id").references("dimensions.id").onDelete("CASCADE");
	});

	// Ajout de dimension_id dans lignes_commande (nullable — commandes sans dimension restent valides)
	await knex.schema.alterTable("lignes_commande", (table) => {
		table.integer("dimension_id").unsigned().nullable();
		table.foreign("dimension_id").references("dimensions.id");
	});

	// Formats standards
	await knex("dimensions").insert([
		{ label: "Carte postale (10,5 × 14,8 cm)", largeur_cm: 10.5, hauteur_cm: 14.8 },
		{ label: "13 × 18 cm", largeur_cm: 13.0, hauteur_cm: 18.0 },
		{ label: "21 × 30 cm", largeur_cm: 21.0, hauteur_cm: 30.0 },
		{ label: "30 × 40 cm", largeur_cm: 30.0, hauteur_cm: 40.0 },
		{ label: "50 × 70 cm", largeur_cm: 50.0, hauteur_cm: 70.0 },
	]);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("lignes_commande", (table) => {
		table.dropForeign(["dimension_id"]);
		table.dropColumn("dimension_id");
	});
	await knex.schema.dropTableIfExists("produit_dimensions");
	await knex.schema.dropTableIfExists("dimensions");
}
