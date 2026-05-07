import type { Knex } from "knex";

// ============================================
// Migration initiale — création de toutes les tables
// ============================================

export async function up(knex: Knex): Promise<void> {
	// Table roles
	await knex.schema.createTable("roles", (table) => {
		table.increments("id").primary();
		table.string("nom", 20).notNullable();
	});

	// Table categories
	await knex.schema.createTable("categories", (table) => {
		table.increments("id").primary();
		table.string("nom", 50).notNullable();
	});

	// Table utilisateurs
	await knex.schema.createTable("utilisateurs", (table) => {
		table.increments("id").primary();
		table.string("nom", 50).notNullable();
		table.string("prenom", 50).notNullable();
		table.string("email", 100).notNullable().unique();
		table.string("mot_de_passe", 255).notNullable();
		table.integer("role_id").unsigned().notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.foreign("role_id").references("roles.id");
	});

	// Table produits
	await knex.schema.createTable("produits", (table) => {
		table.increments("id").primary();
		table.string("nom", 100).notNullable();
		table.text("description");
		table.decimal("prix", 10, 2).notNullable();
		table.string("image_url", 500);
		table.string("mockup_url", 500);
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.integer("categorie_id").unsigned().notNullable();
		table.foreign("categorie_id").references("categories.id");
	});

	// Table commandes
	await knex.schema.createTable("commandes", (table) => {
		table.increments("id").primary();
		table.integer("utilisateur_id").unsigned().notNullable();
		table.decimal("montant_total", 10, 2).notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table.foreign("utilisateur_id").references("utilisateurs.id");
	});

	// Table lignes_commande
	await knex.schema.createTable("lignes_commande", (table) => {
		table.increments("id").primary();
		table.integer("commande_id").unsigned().notNullable();
		table.integer("produit_id").unsigned().notNullable();
		table.integer("quantite").notNullable();
		table.decimal("prix_unitaire", 10, 2).notNullable();
		table.foreign("commande_id").references("commandes.id").onDelete("CASCADE");
		table.foreign("produit_id").references("produits.id");
	});

	// Données de référence
	await knex("roles").insert([{ nom: "admin" }, { nom: "client" }]);
	await knex("categories").insert([
		{ nom: "Carte postale" },
		{ nom: "Affiche" },
	]);
}

export async function down(knex: Knex): Promise<void> {
	// Supprime les tables dans l'ordre inverse
	await knex.schema.dropTableIfExists("lignes_commande");
	await knex.schema.dropTableIfExists("commandes");
	await knex.schema.dropTableIfExists("produits");
	await knex.schema.dropTableIfExists("utilisateurs");
	await knex.schema.dropTableIfExists("categories");
	await knex.schema.dropTableIfExists("roles");
}
