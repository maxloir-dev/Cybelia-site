import type { Knex } from "knex";

// ============================================
// Migration 002 — Ajout de mockup_url sur produits
// ============================================

export async function up(knex: Knex): Promise<void> {
	// La migration 001 crée désormais déjà la colonne `mockup_url`. Sur une base
	// vierge, l'ajouter ici à nouveau échouerait ("Duplicate column"). On vérifie
	// donc d'abord son existence (no-op si elle est déjà là).
	const existe = await knex.schema.hasColumn("produits", "mockup_url");
	if (!existe) {
		await knex.schema.alterTable("produits", (table) => {
			table.string("mockup_url", 500).nullable();
		});
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("produits", (table) => {
		table.dropColumn("mockup_url");
	});
}
