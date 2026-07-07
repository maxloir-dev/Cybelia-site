import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
	direction: "up" | "down"; // Changement ici : de haut en bas
	delay?: number;
	className?: string;
	children: ReactNode;
};

export default function RevealCard({
	direction,
	delay = 0.1,
	className,
	children,
}: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { margin: "-60px", once: false });

	// Remplacement de X par Y pour l'axe vertical
	// "up" fait monter la carte (elle part de plus bas : +80)
	// "down" fait descendre la carte (elle part de plus haut : -80)
	const yIn = direction === "up" ? 80 : -80;
	const yOut = direction === "up" ? -80 : 80;

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: yIn }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOut }}
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
