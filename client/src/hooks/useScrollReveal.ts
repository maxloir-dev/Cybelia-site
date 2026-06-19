import { useEffect, useRef } from "react";

export const useScrollReveal = (dep?: unknown) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		void dep;

		const items = containerRef.current?.querySelectorAll(".scroll-item");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const target = entry.target as HTMLElement;
					// On récupère la direction initiale sauvegardée (left ou right)
					const direction = target.dataset.direction;

					if (entry.isIntersecting) {
						// L'élément entre dans l'écran : position normale
						target.classList.add("scroll-visible");
						target.classList.remove(
							"scroll-hidden-left",
							"scroll-hidden-right",
						);
					} else {
						// L'élément sort : on lui remet SA classe d'origine
						target.classList.remove("scroll-visible");
						if (direction === "left") {
							target.classList.add("scroll-hidden-left");
						} else {
							target.classList.add("scroll-hidden-right");
						}
					}
				}
			},
			{
				threshold: 0.15,
				rootMargin: "0px 0px -40px 0px",
			},
		);

		if (items) {
			items.forEach((el, index) => {
				const target = el as HTMLElement;

				// On nettoie les anciennes classes pour éviter les conflits
				target.classList.remove(
					"scroll-visible",
					"scroll-hidden-left",
					"scroll-hidden-right",
				);

				// Alternance : Index pair (0, 2, 4...) = Gauche | Index impair (1, 3, 5...) = Droite
				if (index % 2 === 0) {
					target.dataset.direction = "left";
					target.classList.add("scroll-hidden-left");
				} else {
					target.dataset.direction = "right";
					target.classList.add("scroll-hidden-right");
				}

				observer.observe(target);
			});
		}

		return () => observer.disconnect();
	}, [dep]);

	return containerRef;
};
