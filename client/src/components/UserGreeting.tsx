"use client";
import { useState, useEffect } from "react";
import { LayoutTextFlip } from "./ui/layout-text-flip";
interface UserGreetingProps {
	prenom: string;
	nom: string;
}

export function UserGreeting({ prenom, nom }: UserGreetingProps) {
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

	return (
		<div className="navbar-greeting">
			<LayoutTextFlip
				text={`${salutation}, `}
				// L'effet va alterner entre ces trois valeurs
				words={[prenom, nom, `${prenom} ${nom}`]}
			/>
		</div>
	);
}
