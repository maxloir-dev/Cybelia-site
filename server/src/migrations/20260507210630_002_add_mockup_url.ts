import type { Knex } from "knex";

// ============================================
// Migration 002 — Ajout de mockup_url sur produits
// ============================================

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("produits", (table) => {
		table.string("mockup_url", 500).nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("produits", (table) => {
		table.dropColumn("mockup_url");
	});
}
