import { Request, Response } from "express";
import nodemailer from "nodemailer";

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

		await transporter.sendMail({
			from: `"${nom}" <${process.env.MAIL_USER}>`,
			to: process.env.MAIL_DEST,
			replyTo: email,
			subject: `[Cybelia] ${sujet}`,
			html: `
				<h2>Nouveau message de contact</h2>
				<p><strong>Nom :</strong> ${nom}</p>
				<p><strong>Email :</strong> ${email}</p>
				<p><strong>Sujet :</strong> ${sujet}</p>
				<hr />
				<p><strong>Message :</strong></p>
				<p>${message.replace(/\n/g, "<br/>")}</p>
			`,
		});

		res.json({ message: "Message envoyé avec succès" });
	} catch (error) {
		console.error("Erreur envoi mail :", error);
		res.status(500).json({ message: "Erreur lors de l'envoi du message" });
	}
};
