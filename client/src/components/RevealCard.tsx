import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

type Props = {
	direction: Direction;
	delay?: number;
	className?: string;
	children: ReactNode;
};

// Axe et sens de départ de la carte selon la direction demandée :
// up/down bougent sur l'axe vertical (y), left/right sur l'axe horizontal (x).
const DEPART: Record<Direction, { axe: "x" | "y"; valeur: number }> = {
	up: { axe: "y", valeur: 80 },
	down: { axe: "y", valeur: -80 },
	left: { axe: "x", valeur: -80 },
	right: { axe: "x", valeur: 80 },
};

export default function RevealCard({
	direction,
	delay = 0.1,
	className,
	children,
}: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { margin: "-60px", once: false });

	const { axe, valeur } = DEPART[direction];
	const positionDepart = { [axe]: valeur };
	const positionSortie = { [axe]: -valeur };

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, ...positionDepart }}
			animate={
				isInView
					? { opacity: 1, x: 0, y: 0 }
					: { opacity: 0, ...positionSortie }
			}
			transition={{
				duration: 0.7,
				ease: "easeOut",
				delay: isInView ? delay : 0.1,
			}}
		>
			{children}
		</motion.div>
	);
}
