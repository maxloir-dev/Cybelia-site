"use client";
import { useState, useEffect } from "react";
import { LayoutTextFlip } from "./Ui/layout-text-flip";
import "./UserGreeting.css";

interface UserGreetingProps {
	prenom: string;
	nom: string;
}

export function UserGreeting({ prenom }: UserGreetingProps) {
	const [salutation, setSalutation] = useState("Bonjour");

	useEffect(() => {
		// Calcul de l'heure locale
		const heure = new Date().getHours();

		// Entre 18h et 5h du matin, on dit Bonsoir
		if (heure >= 18 || heure < 5) {
			setSalutation("Bonsoir");
		} else {
			setSalutation("Bonjour");
		}
	}, []);

	const displayWords = [
		`${prenom || "à vous"}`,
		"des idées ?", //
		"besoin d'aide ?",
	];

	return (
		<div className="greeting-container">
			<span>{salutation},</span>
			{/* On passe la constante au composant enfant */}
			<LayoutTextFlip words={displayWords} />
		</div>
	);
}
