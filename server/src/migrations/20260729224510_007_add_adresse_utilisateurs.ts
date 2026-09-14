import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("utilisateurs", (table) => {
		table.string("adresse").nullable();
		table.string("code_postal").nullable();
		table.string("ville").nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("utilisateurs", (table) => {
		table.dropColumn("adresse");
		table.dropColumn("code_postal");
		table.dropColumn("ville");
	});
}
