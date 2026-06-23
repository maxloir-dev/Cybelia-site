import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
	direction: "left" | "right";
	delay?: number;
	className?: string;
	children: ReactNode;
};

export default function RevealCard({ direction, delay = 0.1, className, children }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { margin: "-60px", once: false });

	const xIn = direction === "left" ? -80 : 80;
	const xOut = direction === "left" ? 80 : -80;

	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, x: xIn }}
			animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: xOut }}
			transition={{ duration: 0.7, ease: "easeOut", delay: isInView ? delay : 0.1 }}
		>
			{children}
		</motion.div>
	);
}
