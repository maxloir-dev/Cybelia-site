"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface SplitTextProps {
	text: string;
	className?: string;
	delay?: number;
	duration?: number;
	animateOut?: boolean;
	onExitComplete?: () => void;
}

function SplitText({
	text,
	className = "",
	delay = 50,
	duration = 0.8,
	animateOut = false,
	onExitComplete,
}: SplitTextProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const splitRef = useRef<SplitType | null>(null);
	const [fontsLoaded, setFontsLoaded] = useState(false);

	// 1. Attendre les polices
	useEffect(() => {
		document.fonts.ready.then(() => setFontsLoaded(true));
	}, []);

	// 2. Initialiser le découpage
	useEffect(() => {
		if (!containerRef.current || !fontsLoaded) return;
		splitRef.current = new SplitType(containerRef.current, { types: "chars" });

		// Cacher les lettres au départ
		gsap.set(splitRef.current.chars, { opacity: 0, y: 40 });

		// Animation d'entrée immédiate
		gsap.to(splitRef.current.chars, {
			opacity: 1,
			y: 0,
			duration: duration,
			stagger: delay / 1000,
			ease: "power3.out",
		});

		return () => splitRef.current?.revert();
	}, [fontsLoaded, text]);

	// 3. Gérer la sortie
	useGSAP(
		() => {
			if (animateOut && splitRef.current) {
				gsap.to(splitRef.current.chars, {
					opacity: 0,
					y: -40,
					duration: duration,
					stagger: delay / 1000,
					ease: "power3.in",
					onComplete: () => {
						if (onExitComplete) onExitComplete();
					},
				});
			}
		},
		{ dependencies: [animateOut], scope: containerRef },
	);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ overflow: "hidden" }}
		>
			{text}
		</div>
	);
}
export default SplitText;
