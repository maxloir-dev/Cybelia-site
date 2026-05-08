"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface LayoutTextFlipProps {
	text?: string;
	words: string[];
	className?: string;
}

export function LayoutTextFlip({
	text,
	words,
	className,
}: LayoutTextFlipProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, 2500); // Change de mot toutes les 2.5 secondes
		return () => clearInterval(interval);
	}, [words.length]);

	return (
		<div className={`flex items-center gap-1.5 ${className}`}>
			<span className="whitespace-nowrap">{text}</span>
			<div className="relative inline-block h-[1.5em] overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.span
						key={words[index]}
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -20, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="inline-block font-bold text-primary"
					>
						{words[index]}
					</motion.span>
				</AnimatePresence>
			</div>
		</div>
	);
}
