import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.string("prenom_livraison", 100);
		table.string("nom_livraison", 100);
		table.string("email_livraison", 200);
		table.string("telephone", 20);
		table.string("adresse", 255);
		table.string("code_postal", 20);
		table.string("ville", 100);
		table.string("pays", 100).defaultTo("France");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.dropColumn("prenom_livraison");
		table.dropColumn("nom_livraison");
		table.dropColumn("email_livraison");
		table.dropColumn("telephone");
		table.dropColumn("adresse");
		table.dropColumn("code_postal");
		table.dropColumn("ville");
		table.dropColumn("pays");
	});
}
