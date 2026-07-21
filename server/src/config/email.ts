import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { escapeHtml } from "../utils/escapeHtml";
dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export const envoyerEmailConfirmationCommande = async (
	email: string,
	prenom: string,
	commande_id: number,
	lignes: { produit_nom: string; quantite: number; prix_unitaire: number; dimension_label?: string | null }[],
	montant_total: number,
) => {
	const lignesHtml = lignes
		.map(
			(l) => `
			<tr>
				<td style="padding: 8px 0; color: #444;">${l.quantite}× ${l.produit_nom}${l.dimension_label ? ` <span style="color:#999">(${l.dimension_label})</span>` : ""}</td>
				<td style="padding: 8px 0; color: #444; text-align: right;">${(l.quantite * l.prix_unitaire).toFixed(2)} €</td>
			</tr>`,
		)
		.join("");

	await transporter.sendMail({
		from: `"Cybele Architecture" <${process.env.MAIL_USER}>`,
		to: email,
		subject: `Confirmation de votre commande #${commande_id}`,
		html: `
		<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111;">
			<h2 style="font-size: 1.4rem; margin-bottom: 8px;">Merci pour votre commande, ${escapeHtml(prenom)} !</h2>
			<p style="color: #666; margin-bottom: 32px;">Nous avons bien reçu votre achat et nous le préparons avec soin. Vous le recevrez dans les meilleurs délais. À très vite !</p>
			<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
				<thead>
					<tr style="border-bottom: 1px solid #eee;">
						<th style="text-align: left; padding-bottom: 8px; color: #965846; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Article</th>
						<th style="text-align: right; padding-bottom: 8px; color: #965846; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">Prix</th>
					</tr>
				</thead>
				<tbody>${lignesHtml}</tbody>
				<tfoot>
					<tr style="border-top: 1px solid #eee;">
						<td style="padding-top: 12px; font-weight: bold;">Total</td>
						<td style="padding-top: 12px; font-weight: bold; text-align: right;">${montant_total.toFixed(2)} €</td>
					</tr>
				</tfoot>
			</table>
			<p style="color: #999; font-size: 12px; margin-top: 40px;">Cybele Architecture — <a href="https://cybele-architecture.fr" style="color: #965846;">cybele-architecture.fr</a></p>
		</div>
		`,
	});
};

export const envoyerEmailReinitialisation = async (
	email: string,
	token: string,
) => {
	const lien = `${process.env.CLIENT_URL}/reset-password/${token}`;

	await transporter.sendMail({
		from: `"Cybelia" <${process.env.MAIL_USER}>`,
		to: email,
		subject: "Réinitialisation de votre mot de passe",
		html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; margin-bottom: 16px;">Réinitialisation du mot de passe</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 32px;">
          Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous.
          Ce lien est valable <strong>1 heure</strong>.
        </p>
        <a href="${lien}" style="display: inline-block; padding: 14px 32px; background: #965846; color: white; text-decoration: none; border-radius: 4px; font-size: 14px; letter-spacing: 1px;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          Si vous n'avez pas fait cette demande, ignorez cet email.
        </p>
      </div>
    `,
	});
};
