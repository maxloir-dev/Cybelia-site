import type { Knex } from "knex";

// ============================================
// Ajoute la référence au PaymentIntent Stripe sur les commandes.
// Sert à : (1) tracer le paiement, (2) garantir l'idempotence du webhook
//          (l'unicité empêche de créer deux fois la même commande si Stripe
//           rejoue l'événement payment_intent.succeeded).
// ============================================

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.string("stripe_payment_intent_id", 255).nullable().unique();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable("commandes", (table) => {
		table.dropColumn("stripe_payment_intent_id");
	});
}
