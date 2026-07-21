import type { Request, Response } from "express";
import nodemailer from "nodemailer";
import { escapeHtml } from "../utils/escapeHtml";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export const envoyerContact = async (req: Request, res: Response) => {
	try {
		const { nom, email, sujet, message } = req.body;

		if (!nom || !email || !sujet || !message) {
			res.status(400).json({ message: "Tous les champs sont obligatoires" });
			return;
		}

		const sNom = escapeHtml(nom);
		const sEmail = escapeHtml(email);
		const sSujet = escapeHtml(sujet);
		const sMessage = escapeHtml(message).replace(/\n/g, "<br/>");

		await transporter.sendMail({
			from: `"${sNom}" <${process.env.MAIL_USER}>`,
			to: process.env.MAIL_DEST,
			replyTo: sEmail,
			subject: `[Cybelia] ${sSujet}`,
			html: `
				<h2>Nouveau message de contact</h2>
				<p><strong>Nom :</strong> ${sNom}</p>
				<p><strong>Email :</strong> ${sEmail}</p>
				<p><strong>Sujet :</strong> ${sSujet}</p>
				<hr />
				<p><strong>Message :</strong></p>
				<p>${sMessage}</p>
			`,
		});

		res.json({ message: "Message envoyé avec succès" });
	} catch (error) {
		console.error("Erreur envoi mail :", error);
		res.status(500).json({ message: "Erreur lors de l'envoi du message" });
	}
};
