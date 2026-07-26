import type { Knex } from "knex";

// ============================================
// Ajoute les colonnes de réinitialisation de mot de passe.
// Elles avaient été créées à la main sur la base de développement mais
// n'existaient dans aucune migration : la base de production, construite
// uniquement par migrate:latest, ne les avait donc pas et /forgot-password
// y échouait.
// reset_token stocke une empreinte SHA-256 (64 caractères), jamais le jeton
// brut — voir empreinteToken() dans authController.
// ============================================

export async function up(knex: Knex): Promise<void> {
	// Les colonnes existent déjà sur les bases créées à la main : sans ce test,
	// la migration échouerait sur ces environnements
	const dejaPresent = await knex.schema.hasColumn("utilisateurs", "reset_token");
	if (dejaPresent) return;

	await knex.schema.alterTable("utilisateurs", (table) => {
		table.string("reset_token", 255).nullable();
		table.datetime("reset_token_expires").nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("utilisateurs", (table) => {
		table.dropColumn("reset_token");
		table.dropColumn("reset_token_expires");
	});
}
