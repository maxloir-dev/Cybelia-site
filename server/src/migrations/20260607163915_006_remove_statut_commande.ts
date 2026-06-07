import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.dropColumn("statut");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table
			.enum("statut", ["en_attente", "en_preparation", "expediee", "livree"])
			.notNullable()
			.defaultTo("en_attente");
	});
}
