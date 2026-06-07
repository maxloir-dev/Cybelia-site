import {
	useState,
	useRef,
	useEffect,
	useId,
	useCallback,
	type ChangeEvent,
} from "react";
import { motion } from "motion/react";
import "./GooeyInput.css";

function SearchIcon() {
	return (
		<svg
			className="gooey-search-icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}

const springTransition = {
	duration: 0.4,
	type: "spring" as const,
	bounce: 0.25,
};

export interface GooeyInputProps {
	placeholder?: string;
	className?: string;
	collapsedWidth?: number;
	expandedWidth?: number;
	expandedOffset?: number;
	gooeyBlur?: number;
	value?: string;
	onValueChange?: (value: string) => void;
	disabled?: boolean;
}

export function GooeyInput({
	placeholder = "Rechercher...",
	className,
	collapsedWidth = 115,
	expandedWidth = 260,
	expandedOffset = 50,
	gooeyBlur = 5,
	value = "",
	onValueChange,
	disabled = false,
}: GooeyInputProps) {
	const id = useId().replace(/:/g, "");
	const filterId = `gooey-filter-${id}`;
	const inputRef = useRef<HTMLInputElement>(null);
	const prevExpandedRef = useRef(false);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (isExpanded) {
			inputRef.current?.focus();
		} else if (prevExpandedRef.current) {
			onValueChange?.("");
		}
		prevExpandedRef.current = isExpanded;
	}, [isExpanded, onValueChange]);

	const handleExpand = useCallback(() => {
		if (!disabled) setIsExpanded(true);
	}, [disabled]);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			onValueChange?.(e.target.value);
		},
		[onValueChange],
	);

	const handleBlur = useCallback(() => {
		if (!value) setIsExpanded(false);
	}, [value]);

	return (
		<div className={`gooey-wrapper${className ? ` ${className}` : ""}`}>
			<svg className="gooey-filter-svg" aria-hidden>
				<defs>
					<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur in="SourceGraphic" stdDeviation={gooeyBlur} result="blur" />
						<feColorMatrix
							in="blur"
							type="matrix"
							values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
							result="goo"
						/>
						<feComposite in="SourceGraphic" in2="goo" operator="atop" />
					</filter>
				</defs>
			</svg>

			<div
				className="gooey-filter-container"
				style={{ filter: `url(#${filterId})` }}
			>
				<motion.div
					style={{ display: "flex", height: 40, alignItems: "center", justifyContent: "center" }}
					animate={{
						width: isExpanded ? expandedWidth : collapsedWidth,
						marginLeft: isExpanded ? expandedOffset : 0,
					}}
					transition={springTransition}
				>
					<button
						type="button"
						disabled={disabled}
						onClick={handleExpand}
						className="gooey-button"
					>
						{!isExpanded && <SearchIcon />}
						<input
							ref={inputRef}
							type="search"
							autoComplete="off"
							value={value}
							onChange={handleChange}
							onBlur={handleBlur}
							disabled={disabled || !isExpanded}
							placeholder={isExpanded ? placeholder : ""}
							className="gooey-input"
							style={{ display: isExpanded ? "block" : "none" }}
						/>
					</button>
				</motion.div>

				<div className="gooey-bubble-wrapper">
					<motion.div
						className="gooey-bubble"
						initial={{ scale: 0, opacity: 0 }}
						animate={isExpanded ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
						transition={springTransition}
					>
						<SearchIcon />
					</motion.div>
				</div>
			</div>
		</div>
	);
}
