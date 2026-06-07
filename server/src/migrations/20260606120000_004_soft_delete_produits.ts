import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("produits", (table) => {
		table.boolean("actif").notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("produits", (table) => {
		table.dropColumn("actif");
	});
}
