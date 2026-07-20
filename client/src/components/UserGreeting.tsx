"use client";
import { useEffect, useState } from "react";
import { LayoutTextFlip } from "./ui/layout-text-flip";
import "./UserGreeting.css";

interface UserGreetingProps {
	// On les rend optionnels (avec le ?) pour éviter les bugs si déconnecté
	prenom?: string;
	nom?: string;
}

export function UserGreeting({ prenom }: UserGreetingProps) {
	const [salutation, setSalutation] = useState("Bonjour");

	useEffect(() => {
		const heure = new Date().getHours();
		if (heure >= 18 || heure < 5) {
			setSalutation("Bonsoir");
		} else {
			setSalutation("Bonjour");
		}
	}, []);

	// Si prenom existe, on affiche le prénom. Sinon, on met "par ici" (ou "à vous", "visiteur")
	const premierMot = prenom && prenom.trim() !== "" ? prenom : "par ici";

	const displayWords = [
		premierMot,
		"des idées ?",
		"une envie ?",
		"un projet ?",
	];

	return (
		<div className="greeting-container">
			<span>{salutation},</span>
			{/* Le composant reste là et tourne toujours, la structure est 100% identique */}
			<LayoutTextFlip words={displayWords} />
		</div>
	);
}
