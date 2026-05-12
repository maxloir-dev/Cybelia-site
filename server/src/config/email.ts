import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

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
